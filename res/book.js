

let searchBtn = $('.search-btn');
let bookSearch = $('.book-search');
let pageNation = $('.page-nation');
let modal = $('#modal');
let limitCount = 10;
let currentPage = 1;

searchBtn.on('click', function(event){
    if($('.book-search').val() == "") return;
    ajax();
});

function enterkey(){
    if(window.event.keyCode == 13){
        if( $('.book-search').val() == "") return;
        ajax();
    }
}

function ajax(pageText=1,pageInx){
    let value = $('.book-search').val();
    let targetType = $('input[name="searchType"]:checked').val();
    let sortType = $('input[name="sortType"]:checked').val();
    let pageNum = pageText;
    
    $.ajax({
        method: "GET",
        url: "https://dapi.kakao.com/v3/search/book",
        data: { 
            query : value,
            target: targetType,
            sort:sortType,
            size:30,
            page:pageNum
            },
        headers : {Authorization: "KakaoAK 89978fd2907d1a3e408ed5fb69c9fd82"},
        success : function(data, status, xhr){

            let totalPage = Math.round(data.meta.pageable_count / 30); //토탈 페이지 번호
            render(currentPage, totalPage, pageNum);
        }
    })
        .done(function( msg ) {
            //책 리스트 나열
        $('.book-list-wrap').html("");
            let arrLen = msg.documents.length;

            if(arrLen == 0){
                alert('검색 도서가 없습니다.');
                $('.book-search').val("");
            }

            for(let i=0;i<arrLen;i++){
            let html = `
            <li class="book-list">
                <div class="thumb">
                <img class="thumb-img" src=${msg.documents[i].thumbnail}/>
                </div>
                <div class="title">${msg.documents[i].title}</div>
                <p class="authors">${msg.documents[i].authors}</p>
                <p class="publisher">${msg.documents[i].publisher}</p>
            </li>`
                        
            $('.book-list-wrap').append(html);
            }
            let mainThumb = $('.thumb-img')
            imgError(mainThumb);
            //검색 글자 색상
            $(".title:contains('"+value+"')").each(function(){
                var regex = new RegExp(value,'gi');
                $(this).html($(this).text().replace(regex, "<span class='txt-hlight'>"+value+"</span>)") );
            })

            //모달 열기

            $('.book-list').on('click', function(event){
                modal.addClass('on');
                $('body').addClass('off');
                let idx = $(this).index();
                    $('.book-info-title').text(msg.documents[idx].title);
                    $('.book-info-thumb').html(`<img class="info-thumb-img" src=${msg.documents[idx].thumbnail}/>`);
                    $('.more-book-authors').text(msg.documents[idx].authors);
                    $('.more-book-price').text(msg.documents[idx].price+'원');
                    $('.more-book-isbn').text(msg.documents[idx].isbn);
                    $('.more-book-publisher').text(msg.documents[idx].publisher);
                    $('.more-book-status').text(msg.documents[idx].status);
                    $('.book-more-text').text(msg.documents[idx].contents+'...');
                    $('.book-more-link').attr("href",msg.documents[idx].url);
                 
                    let infoThumb = $('.info-thumb-img')
                    imgError(infoThumb);
            });

           
        });
}

//모달 닫기

$(document).on('click','.close-btn', function(){
    modal.removeClass('on');
    $('body').removeClass('off');
});


//페이지 버튼 클릭
$(document).on('click','.page-list', function(e){
    // if(msg.meta.is_end) return;
    // $('.page-list').removeClass('active');
    let pageText = $(this).text();
    ajax(pageText);
})

//버튼 그리기

function render(page, totalPage,pageNum){
    renderButton(page ,totalPage,pageNum)
}

function renderButton(currentPage ,totalPage,pageNum){
    pageNation.html("");
        let prev =  `
        <li class="page-prev">이전</li>
        `
        pageNation.append(prev);

        for(let i = currentPage; i < currentPage + limitCount && i<=totalPage ;i++){
            let html = `<li class="page-list">${i}</li>`;
            pageNation.append(html);

        }
        let next =  `
        <li class="page-next">다음</li>
        `
        pageNation.append(next);

        pageNum<10 ? pageNum = pageNum :  pageNum = pageNum % 10;
        $('.page-list').eq(pageNum-1).addClass('active');
        
        if(currentPage - limitCount < 1) pageNation.children('.page-prev').remove();
        if(currentPage + limitCount > totalPage) pageNation.children('.page-next').remove();
        
}

//이전 다음 버튼

$(document).on('click','.page-prev', function(){
    goPrevPage();
    
});

$(document).on('click','.page-next', function(){
    goNextPage();
    
});

function goPrevPage(){
    currentPage -= limitCount;
    render(currentPage);
    ajax(currentPage);
}
function goNextPage(){
    currentPage += limitCount;
    render(currentPage);
    ajax(currentPage);
}

function onErrorImage(){
    console.log(this);
}

//이미지 로딩 오류

function imgError(object){
    object.each(function(idx, item){
        item.onerror = function(){
            $(this).addClass('test');
        }
    })
}
