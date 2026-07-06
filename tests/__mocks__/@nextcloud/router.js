// Mock for @nextcloud/router
module.exports = {
  generateUrl: (url, params) => {
    let result = url
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        result = result.replace(`{${key}}`, String(value))
      })
    }
    return result
  },
  getRootUrl: () => '/',
  linkTo: (app, file) => `/apps/${app}/${file}`,
  linkToRemote: (service) => `/remote.php/${service}`,
}
