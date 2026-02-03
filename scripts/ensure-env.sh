#!/usr/bin/env sh
set -eu

envfile=".env"

if [ ! -s "$envfile" ]; then
  echo "Creating minimal root .env with defaults..."
  printf 'JWT_SECRET=%s\n' "$(openssl rand -hex 32)" > "$envfile"
  printf 'AUTH_PORT=4000\n' >> "$envfile"
  printf 'WEB_PORT=3000\n' >> "$envfile"
  printf 'USER_PORT=4001\n' >> "$envfile"
  printf 'AI_PORT=4002\n' >> "$envfile"
  printf 'TRACEABILITY_PORT=4002\n' >> "$envfile"
  printf 'OPERATIONS_PORT=4003\n' >> "$envfile"
  printf 'NEXT_PUBLIC_AUTH_URL=http://localhost:4000\n' >> "$envfile"
else
  # Append defaults for any missing or empty keys (preserve existing non-empty values)
  pairs="JWT_SECRET:$(openssl rand -hex 32) AUTH_PORT:4000 WEB_PORT:3000 USER_PORT:4001 AI_PORT:4002 TRACEABILITY_PORT:4002 OPERATIONS_PORT:4003 NEXT_PUBLIC_AUTH_URL:http://localhost:4000"
  for pair in $pairs; do
    key=$(printf '%s' "$pair" | cut -d: -f1)
    default=$(printf '%s' "$pair" | cut -d: -f2-)
    if grep -qE "^${key}=" "$envfile" >/dev/null 2>&1; then
      val=$(grep -E "^${key}=" "$envfile" | tail -n1 | cut -d= -f2-)
      if [ -z "$val" ]; then
        printf '%s=%s\n' "$key" "$default" >> "$envfile"
      fi
    else
      printf '%s=%s\n' "$key" "$default" >> "$envfile"
    fi
  done
fi
