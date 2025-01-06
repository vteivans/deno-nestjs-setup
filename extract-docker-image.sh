#!/bin/bash

IMAGE_TAG="${1}"
TEMP_CONTAINER="temp-container"
TIMESTAMP="$(date '+%Y%m%d-%H%M%S')"
OUTPUT_DIR="inspect/$TIMESTAMP-$IMAGE_TAG"

if [ "$IMAGE_TAG" = "--help" -o "$IMAGE_TAG" = "-h" ]; then
    echo "./extract-docker-image.sh <image tag>"
    exit 0
fi

if [ -z "$IMAGE_TAG" ]; then
    echo "Image tag not specified. Please pass after the script: `./extract-docker-image.sh <image tag>`"
    exit 1
fi

if [ -d "$OUTPUT_DIR" ]; then
    echo "Target directory already exists: $OUTPUT_DIR"
    exit 1
fi

# Show the history of the image for easier result inspection
docker history $IMAGE_TAG

# Create and extract the content of a container
# echo "Creating a temporary container: $TEMP_CONTAINER"
# docker create --name $TEMP_CONTAINER $IMAGE_TAG

# echo "Exporting the temporary container to an archive: $TEMP_CONTAINER.tar"
# docker export $TEMP_CONTAINER -o "$TEMP_CONTAINER.tar"

echo "Saving given image to an archive: $TEMP_CONTAINER.tar"
docker save $IMAGE_TAG -o "$TEMP_CONTAINER.tar"

echo "Extracting the content of the image archive into: $OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR"
tar -xf "$TEMP_CONTAINER.tar" -C "$OUTPUT_DIR"

# Cleanup
# docker rm $TEMP_CONTAINER
rm -rf "$TEMP_CONTAINER.tar"

# Extract each blob file
BLOBS_DIR="$OUTPUT_DIR/blobs/sha256"
for BLOB in $BLOBS_DIR/*; do
    BLOB_ID=$(basename $BLOB)
    BLOB_OUTPUT_DIR="$OUTPUT_DIR/layers/$BLOB_ID"

    if [ -d "$BLOB_OUTPUT_DIR" ]; then
        echo "$BLOB_OUTPUT_DIR already exists"
        continue
    fi
    if ! tar -tf "$BLOB" > /dev/null 2>&1; then
        continue
    fi

    mkdir -p $BLOB_OUTPUT_DIR
    echo "extracting $BLOB_OUTPUT_DIR"
    tar -xf "$BLOB" -C "$BLOB_OUTPUT_DIR"
done

echo "DONE"
