const dropdownbtn =document.getElementById('btn');
const dropdownmenu = document.getElementById('show');
const togglearrow = document.getElementById('arrow');
// toggle dropdown function
const toggledropdown = Function (){
    dropdownmenu.classlist.toggle('show');
    togglearrow.classlist.toggle('arrow');
};
//open/close toggle
dropdownbtn.addEventListener('click' function (e)
{
    e.stopPropagation();
    toggledropdown()
});
//close show(dropdown)
document.documentElement.addEventListener('click',function(){
    if(dropdownmenu.classList.contains('show')){
        toggledropdown();
    }
})

const item = document.querySelectorAll('.accordion=item');
item.forEach(item={
    const header = item.querySelector('.accordion=header');
    const content =item.querySelector('.accordion=condent');
})

header.addEventListener('click',()={
    const isopen =item.classList.contains('active');

    //close all
    Item forEach(i ={
        i.classList.remove('active');
        i.querySelector('.accordion=content').style.maxheight=null;
    });

    //toggle current
    if (isopen){
        item.classList.add('active');
        content.style.maxheight = content.scrollHeight +'px';
    }
});