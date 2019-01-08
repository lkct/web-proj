import base64
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import padding

priv_key = '/var/www/html/private.key'
pub_key = '/var/www/html/grp-srv/public.key'


def encrypt(data):
    public_key = open(pub_key).read()
    public_key = serialization.load_pem_public_key(public_key, default_backend())
    enc = public_key.encrypt(data, padding.PKCS1v15())
    return base64.b64encode(enc)


def decrypt(data):
    private_key = open(priv_key).read()
    private_key = serialization.load_pem_private_key(private_key, None, default_backend())
    dec = base64.b64decode(data)
    return private_key.decrypt(dec, padding.PKCS1v15())
