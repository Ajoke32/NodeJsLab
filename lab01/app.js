import * as um from  "./user.js";
import yargs from "yargs";

yargs.version('1.1.0');

yargs.command({
    command:'add',
    describe:'Adding new language',
    builder:{
        title:{
            describe:'Language title',
            demandOption:true,
            type:'string'
        },
        level:{
            describe:'Language level',
            demandOption:true,
            type:'string'
        }
    },
    handler:(argv)=>{
        um.addLang(argv.title,argv.level);
    }
});
yargs.command({
    command:'remove',
    describe:'Removing language',
    builder:{
        title:{
            describe:'Language title',
            demandOption:true,
            type:'string'
        }
    },
    handler:(arg)=>{
        um.removeLang(arg.title);
    }
});
yargs.command({
    command:'list',
    describe:'List of languages',
    handler:()=>{
        console.log(um.getList());
    }
});
yargs.command({
    command:'read',
    describe:'Get language',
    builder:{
        title:{
            describe:'Language title',
            demandOption:true,
            type:'string'
        }
    },
    handler:(arg)=>{
        console.log(um.getLang(arg.title));
    }
});
yargs.parse();
