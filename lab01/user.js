import * as fs from 'fs';


const saveChanges = (user) =>{
    fs.writeFile("./user.json", JSON.stringify(user), err => {
        if (err) {
            console.log(err);
        }
    });
};
const getUser = () =>{
    return JSON.parse(fs.readFileSync('./user.json','utf-8'));
};
const langIsExist = (lang,title) =>{
    return lang.find(i=>i.title===title);
};
export const addLang = (title,level)=> {
    const user = getUser();
    const languages = user.languages;
    if(!langIsExist(languages,title)){
        user.languages.push({'title': title, 'level': level});
        saveChanges(user);
        console.log("Language added");
        return true;
    }
    console.log("Language already exist");
    return false;
}

export const removeLang = (title)=>{
    const user = getUser();
    const languages = user.languages;
    if(langIsExist(languages,title)) {
        user.languages = languages.filter(l => l.title !== title)
        saveChanges(user);
        console.log("Language removed")
        return true;
    }
    console.log("Language not exist");
    return false;
};
export const getLang = (title)=>{
  const user = getUser();
  return user.languages.filter(l=>l.title===title);
};
export const getList = ()=>{
    const user = getUser();
    return user.languages;
};








