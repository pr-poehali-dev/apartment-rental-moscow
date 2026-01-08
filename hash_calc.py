import hashlib

password = "3Dyzaape29938172"
hash_object = hashlib.sha256(password.encode())
hex_digest = hash_object.hexdigest()
print(hex_digest)
