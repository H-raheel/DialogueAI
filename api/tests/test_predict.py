import pytest
import requests
import random

def checkConditions(dict_):
    result = True
    if dict_['driven'] < 0 or dict_['age'] < 0:
        result = False
    if any([
        dict_['fuel'] not in range(1, 5),
        dict_['seller'] not in range(1, 4),
        dict_['transmission'] not in range(1, 3),
        dict_['owner'] not in range(1, 5)
    ]):
        result = False
    return result

def getRandomInputs():
    test_data = []
    total = 0
    while total == 0:
        total = 0
        for _ in range(50):
            data = {
                "uid": 123,
                "age": random.randint(-2, 10),
                "driven": round(random.uniform(-1000, 100000), 2),
                "fuel": random.randint(1, 5),
                "seller": random.randint(1, 4),
                "transmission": random.randint(1, 3),
                "owner": random.randint(1, 5),
            }
            total += 1 if checkConditions(data) else 0
            test_data.append([data, checkConditions(data)])
    return test_data

def test_prediction():
    test_cases = getRandomInputs()
    for test_case in test_cases:
        data = test_case[0]
        response = requests.post(
            'http://localhost:3000/api/get_prediction',
            json=data
        )
        print(response)
        response = response.json()
        response = True if response['error'] == "None" else False
        assert response == test_case[1]


def test_getDetails():
    response = requests.post(
        'http://localhost:3000/api/get_details',
        json={'id': 1}
    )
    response = response.json()
    assert response 

def test_getHistory():
    response = requests.post(
        'http://localhost:3000/api/get_history',
        json={'uid': 123}
    )
    response = response.json()
    assert response['data']