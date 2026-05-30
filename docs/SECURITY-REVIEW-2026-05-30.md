# Security Review - 2026-05-30

**Repository:** ashcoft/nextcloud-cad-viewer  
**Review Date:** 2026-05-30  
**Reviewer:** OpenHands Agent

---

## Executive Summary

✅ **All vulnerabilities identified have been remediated.** The project is using patched versions of all dependencies with known security advisories.

---

## Dependencies Analyzed

| Type | Count |
|------|-------|
| NPM packages (prod) | 147 |
| NPM packages (dev) | 1,171 |
| NPM packages (optional) | 4 |
| PHP packages | 71 |
| **Total** | **1,323+** |

---

## Vulnerabilities Found

### 1. lodash-es - 3 Advisories (Previously High, Now Resolved)

**Current Version:** 4.18.1 (transitive via @mlightcad/cad-viewer)

| GHSA | Severity | CVSS | Description | Vulnerable Range | Patched |
|------|----------|------|-------------|------------------|---------|
| [GHSA-r5fr-rjxr-66jc](https://github.com/advisories/GHSA-r5fr-rjxr-66jc) | High | 8.1 | Code Injection via `_.template` | <= 4.17.23 | 4.18.0 |
| [GHSA-xxjr-mmjv-4gpg](https://github.com/advisories/GHSA-xxjr-mmjv-4gpg) | Medium | 6.5 | Prototype Pollution in `_.unset`/`_.omit` | <= 4.17.22 | 4.17.23 |
| [GHSA-f23m-r3pf-42rh](https://github.com/advisories/GHSA-f23m-r3pf-42rh) | Medium | 6.5 | Prototype Pollution via array path bypass | <= 4.17.23 | 4.18.0 |

**Status:** ✅ RESOLVED - Project uses lodash-es 4.18.1

### 2. js-cookie - 1 Advisory (High, Now Resolved)

**Current Version:** 3.0.8 (transitive via js-beautify→editorconfig)

| GHSA | Severity | CVSS | Description | Vulnerable Range | Patched |
|------|----------|------|-------------|------------------|---------|
| [GHSA-qjx8-664m-686j](https://github.com/advisories/GHSA-qjx8-664m-686j) | High | 7.5 | Per-instance prototype hijack enables cookie-attribute injection | <= 3.0.5 | 3.0.7 |

**Status:** ✅ RESOLVED - Project uses js-cookie 3.0.8

---

## Summary Table

| Package | Current Version | Vulnerable? | Risk Level |
|---------|-----------------|-------------|------------|
| lodash-es | 4.18.1 | ❌ No | Resolved |
| js-cookie | 3.0.8 | ❌ No | Resolved |
| @mlightcad/cad-viewer | 1.5.1 | ❌ No | Resolved |
| element-plus | 2.14.1 | ❌ No | Resolved |
| three | 0.184.0 | ❌ No | Resolved |
| vue | 3.5.35 | ❌ No | Resolved |

---

## Recommendations

1. **No immediate action required** - All known vulnerabilities are patched.
2. **Continue Dependabot monitoring** - Enable Dependabot security updates if not already enabled.
3. **Regular security audits** - Schedule periodic security reviews (quarterly recommended).
4. **Keep package.json overrides** - The current `overrides` section in package.json correctly pins secure versions.

---

## Files Reviewed

- `package.json` - NPM dependencies and overrides
- `pnpm-lock.yaml` - Locked dependency versions
- `composer.json` - PHP dependencies
- `composer.lock` - PHP dependency lock file

---

*This review was generated programmatically using npm audit and the GitHub Advisory Database API.*