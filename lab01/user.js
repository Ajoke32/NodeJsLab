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

export const addLang = (title,level)=> {
    const user = getUser();
    user.languages.push({'title': title, 'level': level});
    saveChanges(user);
}

export const removeLang = (title)=>{
    const user = getUser();
    user.languages = user.languages.filter(l=>l.title!==title)
    saveChanges(user);
};
export const getLang = (title)=>{
  const user = getUser();
  return user.languages.filter(l=>l.title===title);
};
export const getList = ()=>{
    const user = getUser();
    return user.languages;
};








