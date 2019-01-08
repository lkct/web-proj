import jwt
import datetime

priv_key = '/var/www/html/private.key'
pub_key = '/var/www/html/grp-srv/public.key'

def generate(msg, exp_time=60):
    private_key = open(priv_key).read()
    msg['exp'] = datetime.datetime.utcnow() + datetime.timedelta(seconds=exp_time)
    token = jwt.encode(msg, private_key, algorithm='RS256')
    return token


def check(token):
    public_key = open(pub_key).read()
    try:
        msg = jwt.decode(token, public_key, algorithms='RS256')
        msg['errno'] = 0
    except jwt.PyJWTError, e:
        msg = {'errno': 1, 'errmsg': 'Invalid token'}
    return msg
