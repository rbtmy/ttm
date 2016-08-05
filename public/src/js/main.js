$(function () {
    let sinceParamButton = document.getElementById('ttm-since-btn');
    let untilParamButton = document.getElementById('ttm-until-btn');
    let userParamButton = document.getElementById('ttm-user-btn');
    let tweetFetchButton = document.getElementById('ttm-submit-btn');
    let offset = 0;

    tweetFetchButton.addEventListener('click', function () {
        let url = 'http://localhost:3000/statuses/';
        /**
         * Params filtered need
         * @type {{user: (*|string), since: (*|string), until: (*|string)}}
         */
        let params = {
            user: userParamButton.value,
            since: sinceParamButton.value,
            until: untilParamButton.value,
            offset: offset
        };

        $.ajax({
            url: `/statuses/first/${params.user}`,
            type: 'GET',
            data: params,
            success: function() {

            }
        }).done(function (msg) {
            alert(msg);
        });
    });
});
