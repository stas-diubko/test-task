'use strict'

jQuery(function($) {
    $('form').on('submit', function(event) {
        event.preventDefault();
        if (validateForm()) {
            return false;
        }
        $.post("http://codeit.ai/codeitCandidates/serverFrontendTest/user/registration", {
                'name': $(".user-name").val(),
                'secondname': $(".user-secondname").val(),
                'email': $(".user-email").val(),
                'gender': $(".user-gender").val(),
                'pass': $(".pass").val(),
            },
            function(data, status) {
                if (data.status === 'OK') {
                    document.location.href = 'companies.html';
                } else {
                    alert(data.message)
                }
            }
        );

    });

    function validateForm() {
        $(".text-error").remove();

        // Проверка поля user name

        var userName = $(".user-name");
        if (userName.val().length < 3) {
            var valName = true;
            userName.after('<span class="text-error for-name">Имя пользователя должно быть больше 3 символов</span>');
            $(".for-name").css({ top: userName.position().top + userName.outerHeight() + 2 });
            userName.css('border', '1px solid red');
        }
        $(".user-name").toggleClass('error', valName);

        // Проверка поля user secondname

        var userSecondname = $(".user-secondname");
        if (userSecondname.val().length < 3) {
            var valSecondname = true;
            userSecondname.after('<span class="text-error for-secondname">Логин должен быть больше 3 символов</span>');
            $(".for-secondname").css({ top: userSecondname.position().top + userSecondname.outerHeight() + 2 });
            userSecondname.css('border', '1px solid red');
        }
        $(".user-secondname").toggleClass('error', valSecondname);

        // Проверка e-mail

        var reg = /^\w+([\.-]?\w+)*@(((([a-z0-9]{2,})|([a-z0-9][-][a-z0-9]+))[\.][a-z0-9])|([a-z0-9]+[-]?))+[a-z0-9]+\.([a-z]{2}|(com|net|org|edu|int|mil|gov|arpa|biz|aero|name|coop|info|pro|museum))$/i;
        var userEmail = $(".user-email");
        var valEmail = userEmail.val() ? false : true;

        if (valEmail) {
            userEmail.after('<span class="text-error for-email">Поле e-mail обязательно к заполнению</span>');
            $(".for-email").css({ top: userEmail.position().top + userEmail.outerHeight() + 2 });
            userEmail.css('border', '1px solid red');
        } else if (!reg.test(userEmail.val())) {
            valEmail = true;
            userEmail.after('<span class="text-error for-email">Вы указали недопустимый e-mail</span>');
            $(".for-email").css({ top: userEmail.position().top + userEmail.outerHeight() + 2 });
            userEmail.css('border', '1px solid red');
        }
        $(".user-email").toggleClass('error', valEmail);

        // Проверка пароля

        var userPass = $(".pass");

        var valPass = userPass.val() ? false : true;

        if (userPass.val().length < 6) {
            var valPass = true;
            userPass.after('<span class="text-error for-pass">Пароль должен быть не менее 6 символов</span>');
            $(".for-pass").css({ top: userPass.position().top + userPass.outerHeight() + 2 });
        }

        $(".pass").toggleClass('error', valPass);

        return (valName || valSecondname || valEmail || valPass);
    }

});

// получаю данные компаний

$.get("http://codeit.ai/codeitCandidates/serverFrontendTest/company/getList", function(data) {

    // console.log(data);

    // отображаю список компаний

    if (data.list.length == 0) {
        $('.list-wrap ul').append('<div>list is empty</div>');
        $('.companies-count').html('<div>0</div>')

    } else {
        for (let i = 0; i < data.list.length; i++) {
            $('.list-wrap ul').append('<li>' + data.list[i].name + '</li>');
            $('.companies-count').html(data.list.length)
        }
    }

    if (data.status === 'OK') {
        $('.floatingCirclesG').hide();
        $('.content').css("display", "block");
    }

    // отображаю список партнеров

    $('.list-wrap li').on('click', function(event) {
        $('.list-wrap ul').children("li").css('background-color', 'white');
        $(this).css('background-color', 'lightblue');
        $('.partners').css('display', 'block');
        $(".wrap-partners ul").empty();
        let search = $(this).html();
        for (let i = 0; i < data.list.length; i++) {
            for (let key in data.list[i]) {
                if (data.list[i][key] === search) {
                    // сортирую
                    data.list[i].partners.sort(function(a, b) {
                        if (a.value < b.value) {
                            return 1;
                        }
                        if (a.value > b.value) {
                            return -1;
                        }
                        return 0;
                    });
                    for (let j = 0; j < data.list[i].partners.length; j++) {
                        $('.wrap-partners ul').append('<li class="work">' + data.list[i].partners[j].name + '<span>' + data.list[i].partners[j].value + '%' + '</span>' + '</li>');
                        $('.close').on('click', function(event) {
                            $('.partners').css('display', 'none');
                            $('.list-wrap ul').children("li").css('background-color', 'white');
                        })
                    }
                    $('.sort').on('click', function() {
                        $(".wrap-partners ul").empty();
                        data.list[i].partners.reverse()
                        for (let j = 0; j < data.list[i].partners.length; j++) {
                            $('.wrap-partners ul').append('<li class="work">' + data.list[i].partners[j].name + '<span>' + data.list[i].partners[j].value + '%' + '</span>' + '</li>');
                            $('.close').on('click', function(event) {
                                $('.partners').css('display', 'none');
                                $('.list-wrap ul').children("li").css('background-color', 'white');
                            })
                        }
                    })
                }
            }
        }
    })
});

// получаю список новостей

$.get("http://codeit.ai/codeitCandidates/serverFrontendTest/news/getList", function(data) {
    // console.log(data)

    for (let i = 0; i < data.list.length; i++) {
        let nowDate = new Date(data.list[i].date * 1000);
        let date = nowDate.getDate() + '.' + (nowDate.getMonth() + 1) + '.' + nowDate.getFullYear();
        $('.news-wrapper').prepend('<div class="news-wrap">' + '<h3>' + 'News' + '</h3>' + '<div class="row">' + '<div class="col-sm news-col1">' + '<img src="' + data.list[i].img + 'alt="picture">' + '<h4 class="news-name">' + data.list[i].author + '</h4>' + '<div class="news-date">' + date + '</div>' + '</div>' + '<div class="col-sm news-col2">' + '<h4>' + '<a href="https://' + data.list[i].link + '">' + 'Title' + '</a>' + '</h4>' + '<p>' + data.list[i].description + '</p>' + '</div>' + '</div>' + '</div>');
    }
})