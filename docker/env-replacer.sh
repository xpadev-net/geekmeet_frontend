#!/usr/bin/env sh

set -e

# Get environment variables and filter NEXT_PUBLIC_ ones.
printenv | grep NEXT_PUBLIC_ | while read -r ENV_LINE ; do
  # Separate the key and value parts from the found lines.
  ENV_KEY=$(echo $ENV_LINE | cut -d "=" -f1)
  ENV_VALUE=$(echo $ENV_LINE | cut -d "=" -f2)

  # Find all the places where our intermediate values are set and replace them using actual values.
  find .next -type f -exec sed -i "s|_${ENV_KEY}_|${ENV_VALUE}|g" {} \;
done

# Execute the application main command.
exec "$@"
