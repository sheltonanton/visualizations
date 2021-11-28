let curIndex = 5;
document.querySelectorAll('.cover_back > div').forEach(element => {
  element.addEventListener('click', function(event) {
    if(this.classList.contains('open')) {
      curIndex = curIndex + 1;
      this.classList.remove('open');
      this.style.zIndex = curIndex;
    }else{
      if(this.style.zIndex == curIndex && (!this.classList.contains('content'))) {
          console.log(this.classList.contains('content'));
        this.classList.add('open');
        curIndex = curIndex - 1;
      } 
    }
  });
});

document.querySelector('.content').addEventListener('click', function(event) {
    // if(curIndex != 1) {
    //     this.classList.toggle('open');
    // }
});