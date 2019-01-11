import cgi
import os
import sys
import hashlib
import urlparse

tmp_dir = '/var/www/html/grp-srv/tmp'

def save_file(form, params, cursor):
    """
    form:
        file: file chunk content
    params:
        no: number of chunk
    return:
        no: copied from params
        md5: checksum of chunk
    """
    fileitem = form['file']
    cont = fileitem.file.read()

    md5 = hashlib.md5()
    md5.update(cont)
    fn = md5.hexdigest()

    with open(os.path.join(tmp_dir, fn), 'wb') as f:
        f.write(cont)

    msg = {'errno': 0, 'md5': fn, 'no': params['no']}
    return msg