import os
import sys
import pdfminer.high_level
import re
from gql import gql, Client
from gql.transport.requests import RequestsHTTPTransport


header = {'Authorization': 'bearer {}', 'Content-Type': 'application/json'}
transport = RequestsHTTPTransport(
    url="http://localhost:5000/graphql", headers=header, use_json=True)
client = Client(transport=transport, fetch_schema_from_transport=True)

path_to_pdf = (sys.argv[1])
# userId = (sys.argv[2])

text = pdfminer.high_level.extract_text(path_to_pdf)
os.remove(path_to_pdf)

# locates special key
special_re = re.compile(r".*?(?=FERPA)", re.DOTALL)
if re.search(special_re, text).group():
    specialKey = re.search(special_re, text).group()

    # locates gpa ing
    gpa_re = re.compile(r"(?<=Weighted)\n*\d*.\d*\s\/\s\d*\s,\sWeighted")
    if re.search(gpa_re, text).group():
        gpa = re.search(gpa_re, text).group()
    else:
        gpa = ''

    # locate graduation ing
    grad_re = re.compile(r"Graduation\s.*\n*\d*\/\d*")
    if re.search(grad_re, text).group():
        grad = re.search(grad_re, text).group()
    else:
        grad = ''

    # locate rank ing
    rank_re = re.compile(r"(?<=GPA)\n*\d*\s\/\s\d*,\sWeighted")
    if re.search(rank_re, text).group():
        rank = re.search(rank_re, text).group()
    else:
        rank = ''

    # located honors ing
    honor_re = re.compile(r"Honors.*(?=Future)", re.DOTALL)
    if re.search(honor_re, text).group():
        honor = re.search(honor_re, text).group()
    else:
        honor = ''

    # located sat scores.
    rw_sat_score = re.compile(r"SAT\s\(.*\n*\d*")
    m_sat_score = re.compile(r"\d*\n*\d*\/\d*\/\d*\n*(?=Evidence)")

    if re.search(rw_sat_score, text).group() and re.search(m_sat_score, text).group():
        sat = re.search(rw_sat_score, text).group() + ' ' + \
            re.search(m_sat_score, text).group()
    else:
        sat = ''

    # located ap scores and tests
    ap_scores_re = re.compile(r"\d\n*(No|Yes).*(?=Testing)", re.DOTALL)
    if re.search(ap_scores_re, text).group():
        ap_scores = re.search(ap_scores_re, text).group()
    else:
        ap_scores = ''

    ap_subs_re = re.compile(r"AP Subject Tests.*?(?=\/)", re.DOTALL)
    if re.search(ap_subs_re, text).group():
        ap_subs = re.search(ap_subs_re, text).group()
    else:
        ap_subs = ''

    # activities
    act_re = re.compile(r"Activities.*?(?=Writing)", re.DOTALL)
    if re.search(act_re, text).group():
        act = re.search(act_re, text).group()
    else:
        act = ''

    # writing
    w_re = re.compile(
        r"Writing\n*Personal Essay.*?(?=Education Progression)", re.DOTALL)
    if re.search(w_re, text).group():
        w = re.search(w_re, text).group()
    else:
        w = ''

    query = gql(
        """
        query sendParsedPDF ($data: pdfReturnInput!) {
            acceptParsedPDF (data: $data) {
                graduationDate
            }
        }
        """
    )

    params = {
        "data": {
            "gpa": gpa,
            "grad": grad,
            "rank": rank,
            "honor": honor,
            "sat": sat,
            "ap_scores": ap_scores,
            "ap_subs": ap_subs,
            "act": act,
            "w": w,
            "specialKey": specialKey,
            # "userId": userId
        }
    }

    response_query = client.execute(query, variable_values=params)
    print(response_query)

else:
    print('Failed to verify common app PDF.')
