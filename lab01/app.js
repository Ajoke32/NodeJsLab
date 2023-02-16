import * as um from  "./user.js";

const getArgValue = (str)=>{
    return str.split('=')[1];
};

switch (process.argv[2]){
    case 'add':{
        const title = getArgValue(process.argv[3]);
        const level = getArgValue(process.argv[4]);
        um.addLang(title,level);
    }
    break;
    case 'remove':{
        const title = getArgValue(process.argv[3]);
        um.removeLang(title);
    }
    break;
    case 'read':{
        const title = getArgValue(process.argv[3]);
        console.log(um.getLang(title));
    }
    break;
    case 'list':{
        console.log(um.getList());
    }
    break;
    default:{
        console.log("invalid command")}
        break;
}
