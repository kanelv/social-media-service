#!/bin/sh
psql --set ON_ERROR_STOP=on -U postgres -d social-media-service_db
# psql -U postgres -c "CREATE EXTENSION IF NOT EXISTS pgcrypto;"
