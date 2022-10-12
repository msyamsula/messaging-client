import {MD5} from "object-hash"

export let hashString = (text) => {
    return MD5(text)
}