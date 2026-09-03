import os
import io
import logging
from typing import Union, BinaryIO, Optional
import boto3
from botocore.client import Config
from botocore.exceptions import ClientError
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger("bhusetu.storage")


class MinioStorageService:
    """
    S3-compatible storage service for BhuSetu documents, KML boundary layers,
    and geo-tagged cadastral survey imagery backed by MinIO.
    """

    def __init__(
        self,
        endpoint_url: Optional[str] = None,
        access_key: Optional[str] = None,
        secret_key: Optional[str] = None,
        bucket_name: Optional[str] = None,
        secure: bool = False,
    ):
        self.endpoint_url = endpoint_url or os.getenv("MINIO_ENDPOINT", "http://localhost:9000")
        self.access_key = access_key or os.getenv("MINIO_ACCESS_KEY", "minioadmin")
        self.secret_key = secret_key or os.getenv("MINIO_SECRET_KEY", "minioadmin")
        self.bucket_name = bucket_name or os.getenv("MINIO_BUCKET_NAME", "land-aquisition-docs")
        self.secure = secure or os.getenv("MINIO_SECURE", "false").lower() == "true"

        self.s3_client = boto3.client(
            "s3",
            endpoint_url=self.endpoint_url,
            aws_access_key_id=self.access_key,
            aws_secret_access_key=self.secret_key,
            config=Config(signature_version="s3v4"),
            region_name="us-east-1",
        )

    def ensure_bucket_exists(self) -> bool:
        """Ensures the target bucket exists, creating it if needed."""
        try:
            self.s3_client.head_bucket(Bucket=self.bucket_name)
            return True
        except ClientError as err:
            error_code = err.response.get("Error", {}).get("Code")
            if error_code in ("404", "NoSuchBucket"):
                try:
                    self.s3_client.create_bucket(Bucket=self.bucket_name)
                    logger.info(f"Created MinIO bucket: {self.bucket_name}")
                    return True
                except ClientError as create_err:
                    logger.error(f"Failed to create bucket {self.bucket_name}: {create_err}")
                    return False
            else:
                logger.error(f"Error checking bucket {self.bucket_name}: {err}")
                return False

    def upload_file(
        self,
        file_data: Union[bytes, bytearray, BinaryIO],
        object_key: str,
        content_type: str = "application/octet-stream",
        metadata: Optional[dict] = None,
    ) -> dict:
        """
        Uploads raw bytes or a file stream to MinIO under the specified object key.
        """
        extra_args = {"ContentType": content_type}
        if metadata:
            extra_args["Metadata"] = metadata

        if isinstance(file_data, (bytes, bytearray)):
            stream = io.BytesIO(file_data)
        else:
            stream = file_data

        try:
            self.s3_client.upload_fileobj(
                Fileobj=stream,
                Bucket=self.bucket_name,
                Key=object_key,
                ExtraArgs=extra_args,
            )
            return {
                "success": True,
                "bucket": self.bucket_name,
                "key": object_key,
                "url": f"{self.endpoint_url}/{self.bucket_name}/{object_key}",
            }
        except ClientError as err:
            logger.error(f"Failed to upload object {object_key}: {err}")
            raise

    def upload_kml(
        self,
        file_data: Union[bytes, BinaryIO],
        project_id: str,
        filename: str,
    ) -> dict:
        """
        Uploads a project KML boundary document with standard KML MIME type.
        """
        clean_filename = os.path.basename(filename)
        object_key = f"projects/{project_id}/kml/{clean_filename}"
        return self.upload_file(
            file_data=file_data,
            object_key=object_key,
            content_type="application/vnd.google-earth.kml+xml",
            metadata={"project_id": str(project_id), "file_type": "kml"},
        )

    def upload_geotagged_image(
        self,
        file_data: Union[bytes, BinaryIO],
        parcel_id: str,
        filename: str,
        content_type: str = "image/jpeg",
    ) -> dict:
        """
        Uploads a cadastral parcel survey or drone geo-tagged photo.
        """
        clean_filename = os.path.basename(filename)
        object_key = f"parcels/{parcel_id}/surveys/{clean_filename}"
        return self.upload_file(
            file_data=file_data,
            object_key=object_key,
            content_type=content_type,
            metadata={"parcel_id": str(parcel_id), "file_type": "survey_image"},
        )

    def generate_presigned_download_url(
        self,
        object_key: str,
        expires_in: int = 3600,
    ) -> str:
        """
        Generates a secure temporary pre-signed URL to read or download a document.
        """
        return self.s3_client.generate_presigned_url(
            ClientMethod="get_object",
            Params={"Bucket": self.bucket_name, "Key": object_key},
            ExpiresIn=expires_in,
        )


_storage_instance: Optional[MinioStorageService] = None


def get_storage_service() -> MinioStorageService:
    """Returns a singleton instance of the MinIO storage client."""
    global _storage_instance
    if _storage_instance is None:
        _storage_instance = MinioStorageService()
    return _storage_instance
