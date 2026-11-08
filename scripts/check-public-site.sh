#!/bin/sh
# Fail the deploy if the published tree contains secrets, backups, or VCS metadata.
set -eu
root=${1:?usage: check-public-site.sh <site-dir>}
hits=$(find "$root" \( \
  -name '.env' -o -name '.env.*' -o -name '.git' -o -name '.svn' -o -name '.hg' -o \
  -name 'id_rsa' -o -name 'id_rsa.pub' -o -name '.htpasswd' -o -name '.htaccess' -o \
  -name 'wp-config.php' -o -name 'phpinfo.php' -o -name 'credentials.json' -o \
  -name 'secrets.json' -o -name 'web.config' -o -name 'serviceAccount.json' -o \
  -name '*.pem' -o -name '*.zip' -o -name '*.sql' -o -name '*.map' -o \
  -name '*.bak' -o -name 'backup*' -o -name '*.tar' -o -name '*.tar.gz' -o \
  -name 'npm-debug.log' -o -name 'debug.log' \
  \) -print)
if [ -n "$hits" ]; then
  echo "Refusing to publish sensitive or backup paths:" >&2
  echo "$hits" >&2
  exit 1
fi
echo "Public site check passed."
