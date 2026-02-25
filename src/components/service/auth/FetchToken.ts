const FetchToken=()=>{
    const token=localStorage.getItem("scrblToken")
    return "Bearer "+token;
}
export default FetchToken;