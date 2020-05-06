export const getHtmlMenu = (menu) => {
    let message = "";
    if(menu == "Sub2"){
        message += "<div>Sub2 G<br></div>\
        <div>Sub2 F&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Sub2 H<br></div>\
        <div>Sub2 E&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Sub2 A<br><div>\
        <div>Sub2 D&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Sub2 B<br></div>\
        <div>Sub2 C</div>";
    }
     else{
        if(menu == ""){
            message += "<div>Sub4<br><br></div>\
            <div>Sub3&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Sub1<br><br><div>\
            <div>Sub2</div>";
  
        }
        else{
            message += "<div>"+ menu +" D<br><br></div>\
            <div>"+ menu +" C&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+ menu +" A<br><br><div>\
            <div>"+ menu +" B</div>";
        }
        
     }
  return message;
}

export const getHtmlNoviceMessage = (menu , text) => {
    let message = "";

    if(menu == "Sub2"){
        message += "<div>Sub2 G<br></div>\
        <div>Sub2 F&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Sub2 H<br></div>\
        <div>Sub2 E&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Sub2 A<br><div>\
        <div>Sub2 D&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Sub2 B<br></div>\
        <div>Sub2 C</div>";
        if(text == "Right") message = message.replace("Sub2 A","<b><u>Sub2 A</b></u>")
        else if(text == "RightDown") message = message.replace("Sub2 B","<b><u>Sub2 B</b></u>")
        else if(text == "Down") message = message.replace("Sub2 C","<b><u>Sub2 C</b></u>")
        else if(text == "LeftDown") message = message.replace("Sub2 D","<b><u>Sub2 D</b></u>")
        else if(text == "Left") message = message.replace("Sub2 E","<b><u>Sub2 E</b></u>")
        else if(text == "LeftUp") message = message.replace("Sub2 F","<b><u>Sub2 F</b></u>")
        else if(text == "Up") message = message.replace("Sub2 G","<b><u>Sub2 G</b></u>")
        else if(text == "RightUp") message = message.replace("Sub2 H","<b><u>Sub2 H</b></u>")
    }
     else{
        if(menu == ""){
            message += "<div>Sub4<br><br></div>\
            <div><b>Sub3</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Sub1<br><br><div>\
            <div>Sub2</div>";
            if(text == "Right") {
                message = message.replace("Sub1","<b><u>Sub1</b></u>");
            }
            else if(text == "Down") message = message.replace("Sub2","<b><u>Sub2</b></u>")
            else if(text == "Left") message = message.replace("Sub3","<b><u>Sub3</b></u>")
            else if(text == "Up") message = message.replace("Sub4","<b><u>Sub4</b></u>")
        }
        else{
            message += "<div>"+ menu +" D<br><br></div>\
            <div>"+ menu +" C&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+ menu +" A<br><br><div>\
            <div>"+ menu +" B</div>";
            if(text == "Right") message = message.replace(menu + " A","<b><u>" + menu + " A</b></u>");
            else if(text == "Down") message = message.replace(menu + " B","<b><u>" + menu + " B</b></u>")
            else if(text == "Left") message = message.replace(menu + " C","<b><u>" + menu + " C</b></u>")
            else if(text == "Up") message = message.replace(menu + " D","<b><u>" + menu + " D</b></u>")
        }
     }
    //console.log(message);
    return message;
}
