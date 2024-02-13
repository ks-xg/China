<script>
    // 定义音乐列表
    var musicList = [
      'music1.mp3',
      'music2.mp3',
      'music3.mp3'
      // 添加更多音乐文件名
    ];

    var playedMusic = []; // 已经播放过的音乐

    // 获取一个随机的音乐
    function getRandomMusic() {
      var randomIndex = Math.floor(Math.random() * musicList.length);
      var randomMusic = musicList[randomIndex];

      // 判断是否已经播放过
      if (playedMusic.includes(randomMusic)) {
        // 若已经播放过，则递归调用获取新的随机音乐
        return getRandomMusic();
      }

      // 将该音乐添加到已播放列表中
      playedMusic.push(randomMusic);

      return randomMusic;
    }

    // 播放音乐
    function playMusic() {
      var audioElement = document.getElementById('music');
      var musicSrc = getRandomMusic();
      audioElement.src = musicSrc;

      // 监听音乐播放结束事件
      audioElement.addEventListener('ended', function() {
        playMusic(); // 音乐播放结束后继续播放下一首
      });
    }

    // 页面加载完成后开始播放音乐
    window.addEventListener('load', function() {
      playMusic();
    });
  </script>
