import argon2 from "argon2"
;(async () => {
  const hash =
    "$argon2id$v=19$m=65536,t=3,p=4$jaZw/YcBWsP0GJ/5cIXcog$krXxcUzFIVMV/vYkjCg886qhYRR9Pkv1hFhlxJj+RRo"
  const valid = await argon2.verify(hash, "112233nn")
  console.log(valid)
})()
