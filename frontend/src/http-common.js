import axios from "axios"

export default axios.create({
    baseURL : "https://api.tingsonghui.com/householdappliances",
    headers : {
        "Content-type" : "application/json"
    }
});