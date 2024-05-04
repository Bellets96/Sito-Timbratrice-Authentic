import greenlockExpress from "greenlock-express";
import "dotenv/config";

const greenlock = greenlockExpress.create({
  version: "draft-17",
  server: "https://acme-v02.api.letsencrypt.org/directory",
  email: process.env.EMAIL_BELLETS,
  agreeTos: true,
  configDir: "./greenlock.d",
  approveDomains: (opts, certs, cb) => {
    if (certs) {
      opts.domains = certs.altnames;
    } else {
      opts.email = opts.email || process.env.EMAIL_BELLETS;
      opts.agreeTos = opts.agreeTos || true;
    }
    cb(null, { options: opts, certs });
  },
});

greenlock.manager.defaults({
  agreeToTerms: true,
  subscriberEmail: process.env.EMAIL_BELLETS,
  agreeToTerms: true,
  rsaKeySize: 2048,
  challenges: {
    "http-01": require("le-challenge-fs").create({
      webrootPath: "/tmp/acme-challenges",
    }),
    "tls-alpn-01": require("le-challenge-tls-alpn01").create({ debug: true }),
  },
  challengeType: "http-01",
});

export default greenlock;
