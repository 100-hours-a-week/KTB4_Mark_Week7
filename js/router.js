export async function post(path, body, headers){
    const url = `http://localhost:8080/${path}`;
    const options = {
        method: "POST",
        headers: {
            "X-XSRF-TOKEN" : getCookie("XSRF-TOKEN"),
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

export async function patch(path, body, headers){
    const url = `http://localhost:8080/${path}`;
    const options = {
        method: "PATCH",
        headers: {
            "X-XSRF-TOKEN" : getCookie("XSRF-TOKEN"),
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

export async function put(path, body, headers){
    const url = `http://localhost:8080/${path}`;
    const options = {
        method: "PUT",
        headers: {
            "X-XSRF-TOKEN" : getCookie("XSRF-TOKEN"),
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

export async function del(path, headers){
    const url = `http://localhost:8080/${path}`;
    const options = {
        method: "DELETE",
        headers: {
            "X-XSRF-TOKEN" : getCookie("XSRF-TOKEN"),
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

function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}