/*
 * List of common api responses
 */

export function notAuthorized(res) {
  res.status(401).send({
    message: "Not authorized",
  });
}

/**
 * Unlike notAuthorized, this is more about preventing
 * exploits, so it's more severe.
 *
 * @param {*} res Response object
 */
export function forbidden(res) {
  res.status(403).send({
    message: "Forbidden",
  });
}

export function error(res, e = { message: "Internal server error" }) {
  console.log(e);
  res.status(500).send({ message: e.message });
}

export function notFound(res) {
  res.status(404).send({ message: "Not found" });
}

export default { notAuthorized, forbidden, error, notFound };
