import {
  buildApi,
  get,
  post,
} from 'redux-bees'
import PropTypes from 'prop-types'
import Cookies from 'js-cookie'

const GET = 'get'
const POST = 'post'

const minosApiEndpoints = {
  login: {
    requestHeaders: {
      csrftoken: PropTypes.string
    },
    requestParams: {
      existingAuthToken: PropTypes.string,
      keepLoggedIn: PropTypes.bool.isRequired,
      password: PropTypes.string,
      username: PropTypes.string.isRequired
    },
    responseFields: {
      accountMesage: PropTypes.string,
      activeVxRewards: PropTypes.array,
      adkv: PropTypes.object,
      allProfileComments: PropTypes.bool,
      artistAudioMessagesEnabled: PropTypes.bool,
      artistPromoEmailsEnabled: PropTypes.bool,
      authToken: PropTypes.string,
      autoplayEnabled: PropTypes.bool,
      birthYear: PropTypes.number,
      config: PropTypes.object,
      emailOptOut: PropTypes.bool,
      explicitContentFilterEnabled: PropTypes.bool,
      gender: PropTypes.string,
      highQualityStreamingEnabled: PropTypes.bool,
      isNew: PropTypes.bool,
      kruxToken: PropTypes.string,
      listenerId: PropTypes.string,
      listenerToken: PropTypes.string,
      minor: PropTypes.bool,
      notifyOnComment: PropTypes.bool,
      notifyOnFollow: PropTypes.bool,
      placeholderProfileImageUrl: PropTypes.string,
      premiumAccessAdUrl: PropTypes.string.isRequired,
      premiumAccessNoAvailsAdUrl: PropTypes.string.isRequired,
      profilePrivate: PropTypes.bool,
      seenEducation: PropTypes.bool,
      smartConversionAdUrl: PropTypes.string,
      smartConversionDisabled: PropTypes.bool,
      smartConversionTimeoutMillis: PropTypes.number,
      username: PropTypes.string.isRequired,
      webClientVersion: PropTypes.string.isRequired,
      webname: PropTypes.string,
      zipCode: PropTypes.string.isRequired
    }
  },
  anonymousLogin: {
    requestHeaders: {
      csrftoken: PropTypes.string
    },
    requestParams: {},
    responseFields: {
      accountMesage: PropTypes.string,
      activeVxRewards: PropTypes.array,
      adkv: PropTypes.object,
      allProfileComments: PropTypes.bool,
      artistAudioMessagesEnabled: PropTypes.bool,
      artistPromoEmailsEnabled: PropTypes.bool,
      authToken: PropTypes.string,
      autoplayEnabled: PropTypes.bool,
      birthYear: PropTypes.number,
      config: PropTypes.object,
      emailOptOut: PropTypes.bool,
      explicitContentFilterEnabled: PropTypes.bool,
      gender: PropTypes.string,
      highQualityStreamingEnabled: PropTypes.bool,
      isNew: PropTypes.bool,
      kruxToken: PropTypes.string,
      listenerId: PropTypes.string,
      listenerToken: PropTypes.string,
      minor: PropTypes.bool,
      notifyOnComment: PropTypes.bool,
      notifyOnFollow: PropTypes.bool,
      placeholderProfileImageUrl: PropTypes.string,
      premiumAccessAdUrl: PropTypes.string.isRequired,
      premiumAccessNoAvailsAdUrl: PropTypes.string.isRequired,
      profilePrivate: PropTypes.bool,
      seenEducation: PropTypes.bool,
      smartConversionAdUrl: PropTypes.string,
      smartConversionDisabled: PropTypes.bool,
      smartConversionTimeoutMillis: PropTypes.number,
      username: PropTypes.string.isRequired,
      webClientVersion: PropTypes.string.isRequired,
      webname: PropTypes.string,
      zipCode: PropTypes.string.isRequired
    }
  },
  info: {
    requestHeaders: {
      authtoken: PropTypes.string,
      csrftoken: PropTypes.string
    },
    requestParams: {},
    responseFields: {
      activeProduct: PropTypes.object.isRequired,
      autoRenew: PropTypes.bool,
      displayablePaymentProvider: PropTypes.string,
      giftee: PropTypes.bool.isRequired,
      inPaymentBackedTrial: PropTypes.bool.isRequired,
      ipgEligible: PropTypes.bool.isRequired,
      paymentProvider: PropTypes.string.isRequired,
      pendingProducts: PropTypes.array.isRequired,
      subscriber: PropTypes.bool.isRequired
    }
  },
  getAvailableProduct: {},
  getCreditCard: {}
}

const config = {
  baseUrl: 'https://mobile-test.savagebeast.com:7443',
  configureHeaders(headers) {
    console.log('VJ', 'configureHeaders', { headers })
    return {
      ...headers,
    }
  },
  afterResolve(result) {
    return Promise.resolve(result)
  },
  afterReject(result) {
    return Promise.reject(result)
  }
}

const api = buildApi(minosApiEndpoints, config)
