export function $saveSessionStorage ( key, value) {
    sessionStorage.setItem(key,JSON.stringify(value));
}

export function $loadSessionStorage ( key ) {
    var tem = sessionStorage.getItem(key);
    tem = eval('(' + tem + ')');
    return tem;
}

export function saveLocalStorage (id, key, value) {
    localStorage.setItem(key,JSON.stringify(value));
}

export function loadLocalStorage (id, key, def) {
    var tem = localStorage.getItem(key);
    tem = eval('(' + tem + ')');
    return tem;
}
