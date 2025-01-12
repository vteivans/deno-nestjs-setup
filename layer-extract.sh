#!/bin/bash
OUTPUT_DIR="${1}"

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
    # gzip -dc $BLOB | tar -xf - -C $BLOB_OUTPUT_DIR
done

echo "DONE"
