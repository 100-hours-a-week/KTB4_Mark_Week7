export async function post(path, body, headers = {}){
    const url = `http://localhost:8080/${path}`;
    const options = {
        method: "POST",
        headers: {
            ...headers
        },
        body: body instanceof FormData ? body : JSON.stringify(body),
        credentials: "include"
    }

    const res = await fetch(url, options);
    const data = await res.json();
    if(res.ok){
        return data;
    } else {
        throw {
            message: data.message,
            status: res.status
        }
    }
}

export async function get(path, headers = {}){
    const url = `http://localhost:8080/${path}`;
    const options = {
        method: "GET",
        headers: {
            ...headers
        },
        credentials: "include"
    }

    const res = await fetch(url, options);
    const data = await res.json();

    if(res.ok) {
        return data;
    } else {
        throw {
            message: data.message,
            status: res.status
        }
    }
}

export async function patch(path, body, headers = {}){
    const url = `http://localhost:8080/${path}`;
    const options = {
        method: "PATCH",
        headers: {
            ...headers
        },
        body: body instanceof FormData ? body : JSON.stringify(body),
        credentials: "include"
    }

    const res = await fetch(url, options);
    const data = await res.json();
    if(res.ok){
        return data;
    } else {
        throw {
            message: data.message,
            status: res.status
        }
    }
}

export async function put(path, body, headers = {}){
    const url = `http://localhost:8080/${path}`;
    const options = {
        method: "PUT",
        headers: {
            ...headers
        },
        body: body instanceof FormData ? body : JSON.stringify(body),
        credentials: "include"
    }

    const res = await fetch(url, options);
    const data = await res.json();
    if(res.ok){
        return data;
    } else {
        throw {
            message: data.message,
            status: res.status
        }
    }
}

export async function del(path, headers = {}){
    const url = `http://localhost:8080/${path}`;
    const options = {
        method: "DELETE",
        headers: {
            ...headers
        },
        credentials: "include"
    }

    const res = await fetch(url, options);
    const data = await res.json();
    if(res.ok){
        return data;
    } else {
        throw {
            message: data.message,
            status: res.status
        }
    }
}