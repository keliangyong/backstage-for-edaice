let util = {
    getcookie(name){
        let r = (new RegExp("\\b" + name + "\\b=([^\\s;]+);?", 'gi')).exec(document.cookie);
        return r && r[1] && unescape(r[1]);    
    }
}


module.exports = util