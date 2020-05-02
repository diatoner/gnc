module.exports = [
  {
    code: '10',
    message: 'INPUT',
    description: `As per definition of single-digit code 1 in 1.3.2.`
  },
  {
    code: '20',
    message: 'SUCCESS',
    description: `As per definition of single-digit code 2 in 1.3.2.`,
  },
  {
    code: '21',
    message: 'SUCCESS - END OF CLIENT CERTIFICATE SESSION',
    description: `The request was handled successfully and a response body will
  follow the response header.  The <META> line is a MIME media
  type which applies to the response body.  In addition, the
  server is signalling the end of a transient client certificate
  session which was previously initiated with a status 61
  response.  The client should immediately and permanently
  delete the certificate and accompanying private key which was
  used in this request.`,
  },

  { 
    code: '30',
    message: 'REDIRECT - TEMPORARY',
    description: `As per definition of single-digit code 3 in 1.3.2.`
  },
  { 
    code: '31',
    message: 'REDIRECT - PERMANENT',
    description: `The requested resource should be consistently requested from
  the new URL provided in future.  Tools like search engine
  indexers or content aggregators should update their
  configurations to avoid requesting the old URL, and end-user
  clients may automatically update bookmarks, etc.  Note that
  clients which only pay attention to the initial digit of
  status codes will treat this as a temporary redirect.  They
  will still end up at the right place, they just won't be able
  to make use of the knowledge that this redirect is permanent,
  so they'll pay a small performance penalty by having to follow
  the redirect each time.`
  },
  { 
    code: '40',
    message: 'TEMPORARY FAILURE',
    description: `As per definition of single-digit code 4 in 1.3.2.`
  },
  {
    code: '41',
    message: 'SERVER UNAVAILABLE',
    description: `The server is unavailable due to overload or maintenance.
  (cf HTTP 503)`,
    },
  { 
    code: '42',
    message: 'CGI ERROR',
    description: `A CGI process, or similar system for generating dynamic
  content, died unexpectedly or timed out.
  `},
  {
    code: '43',
    message: 'PROXY ERROR',
    description: `A proxy request failed because the server was unable to
  successfully complete a transaction with the remote host.
  (cf HTTP 502, 504)`
  },
  {
    code: '44',
    message: 'SLOW DOWN',
    description: `Rate limiting is in effect.  <META> is an integer number of
  seconds which the client must wait before another request is made to this server.
  (cf HTTP 429)`,
  },
  { 
    code: '50',
    message: 'PERMANENT FAILURE',
    description: `As per definition of single-digit code 5 in 1.3.2.`
  },
  {
    code: '51',
    message: 'NOT FOUND',
    description: `The requested resource could not be found but may be available
  in the future. (cf HTTP 404) (struggling to remember this important status code?
  Easy: you can't find things hidden at Area 51!)`
  },
  {
    code: '52',
    message: 'GONE',
    description: `The resource requested is no longer available and will not be
  available again.  Search engines and similar tools should
  remove this resource from their indices.  Content aggregators
  should stop requesting the resource and convey to their human
  users that the subscribed resource is gone.
  (cf HTTP 410)`
  },
  {
    code: '53',
    message: 'PROXY REQUEST REFUSED',
    description: `The request was for a resource at a domain not served by the
  server and the server does not accept proxy requests.`,
  },
  {
    code: '59',
    message: 'BAD REQUEST',
    description: `The server was unable to parse the client's request,
  presumably due to a malformed request.
  (cf HTTP 400)`
  },
  {
    code: '60',
    message: 'CLIENT CERTIFICATE REQUIRED',
    description: `As per definition of single-digit code 6 in 1.3.2.`,
  },
  {
    code: '61',
    message: 'TRANSIENT CERTIFICATE REQUESTED',
    description: `The server is requesting the initiation of a transient client
  certificate session, as described in 1.4.3.  The client should
  ask the user if they want to accept this and, if so, generate
  a disposable key/cert pair and re-request the resource using it.
  The key/cert pair should be destroyed when the client quits,
  or some reasonable time after it was last used (24 hours? Less?)`
  },
  {
    code: '62',
    message: 'AUTHORISED CERTIFICATE REQUIRED',
    description: `This resource is protected and a client certificate which the
  server accepts as valid must be used - a disposable key/cert
  generated on the fly in response to this status is not
  appropriate as the server will do something like compare the
  certificate fingerprint against a white-list of allowed
  certificates.  The client should ask the user if they want to
  use a pre-existing certificate from a stored "key chain".`,
  },
  {
    code: '63',
    message: 'CERTIFICATE NOT ACCEPTED',
    description: `The supplied client certificate is not valid for accessing the
  requested resource.`,
  },
  {
    code: '64',
    message: 'FUTURE CERTIFICATE REJECTED',
    description: `The supplied client certificate was not accepted because its
  validity start date is in the future.`
  },
  {
    code: '65',
    message: 'EXPIRED CERTIFICATE REJECTED',
    description: `The supplied client certificate was not accepted because its
  expiry date has passed.`
  }
];
