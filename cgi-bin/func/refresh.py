import cgi
import os
import sys

from token import generate

def refresh(form, params):
    """
    params:
        NONE
    return
        token: new token
    """
    user = params['user']

    token = generate({'user': user}, 300)

    msg = {'errno': 0, 'token': token}
    return msg
