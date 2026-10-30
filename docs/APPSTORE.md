# Publishing to the Nextcloud App Store

This app is published to <https://apps.nextcloud.com> from the `release.yml`
workflow. Publishing is gated on two repository secrets, so the release
pipeline keeps working (and simply skips the App Store step) until they are
configured.

Reference: <https://nextcloudappstore.readthedocs.io/en/latest/developer.html>

## One-time setup

### 1. Create the signing key and certificate request

The App Store requires every release to be signed with a certificate it has
issued, so it can verify the archive was uploaded by the app's owner.

Generate a private key and a certificate signing request (CSR). **Keep the
private key secret; never commit it.**

```bash
mkdir -p ~/.nextcloud/certificates
cd ~/.nextcloud/certificates

# Private key (KEEP SECRET) and CSR
openssl req -nodes -newkey rsa:4096 \
  -keyout cad_viewer.key \
  -out cad_viewer.csr \
  -subj "/CN=cad_viewer"
```

The app id must be lowercase ASCII with underscores only, so `cad_viewer` is
correct.

### 2. Get the certificate signed

Open a pull request that adds `cad_viewer/cad_viewer.csr` to
<https://github.com/nextcloud/app-certificate-requests>, and make sure the
email address on your GitHub profile is public. Nextcloud verifies ownership
and returns a signed `cad_viewer.crt` in the pull request.

Save the returned certificate next to the key:

```bash
# Paste the contents from the pull request, without leading/trailing whitespace
vi ~/.nextcloud/certificates/cad_viewer.crt
```

### 3. Register the app

Register the app id on <https://apps.nextcloud.com> (or via the REST API). The
web form asks for:

- **Certificate** — the contents of `cad_viewer.crt`
- **Signature** — a signature over the app id using the private key:

  ```bash
  echo -n "cad_viewer" \
    | openssl dgst -sha512 -sign ~/.nextcloud/certificates/cad_viewer.key \
    | openssl base64
  ```

### 4. Add the repository secrets

In the GitHub repository: **Settings → Secrets and variables → Actions → New
repository secret**.

| Secret | Value |
| --- | --- |
| `APP_PRIVATE_KEY` | Contents of `~/.nextcloud/certificates/cad_viewer.key` |
| `APPSTORE_TOKEN` | API token from <https://apps.nextcloud.com> → *My account* → *API-Token* |

Once both are set, the next release is published automatically.

## How the release publishes

`.github/workflows/release.yml` runs:

1. **release** — semantic-release bumps the version, commits, tags and creates
   a draft GitHub release.
2. **build** — checks out the tag, builds the app, creates
   `cad_viewer.tar.gz`, verifies the version inside it, attaches the archives
   to the release, and publishes it.
3. **Publish to the Nextcloud App Store** — signs the release archive with
   `APP_PRIVATE_KEY` and uploads it, referencing the release asset URL, using
   the `R0Wi/nextcloud-appstore-push-action` action.

The App Store then downloads the archive, verifies the signature and the
`appinfo/info.xml`, and creates the release.

## Manual publish

To publish an existing release without re-running the pipeline:

```bash
# 1. Sign the archive with the private key
openssl dgst -sha512 -sign ~/.nextcloud/certificates/cad_viewer.key \
  cad_viewer.tar.gz | openssl base64

# 2. Upload via the App Store web form, or the REST API:
curl -X POST https://apps.nextcloud.com/api/v1/apps/releases \
  -H "Authorization: Token <APPSTORE_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
        "app": "cad_viewer",
        "download": "https://github.com/ashcoft/nextcloud-cad-viewer/releases/download/vX.Y.Z/cad_viewer.tar.gz",
        "signature": "<base64 signature from step 1>",
        "nightly": false
      }'
```

## App Store requirements checklist

- [x] `appinfo/info.xml` validates against the App Store schema
      (`lint-info-xml` workflow).
- [x] App id is lowercase ASCII with underscores (`cad_viewer`) and matches the
      archive's top-level folder.
- [x] `licence` is one of the allowed identifiers (`MIT`).
- [x] `<dependencies>` declares PHP and Nextcloud versions.
- [x] `CHANGELOG.md` is present at the top level.
- [ ] Signing certificate issued and app registered (steps 1–3 above).
- [ ] `APP_PRIVATE_KEY` and `APPSTORE_TOKEN` repository secrets set (step 4).
