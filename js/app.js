(function () {
  Date.prototype.yyyymmdd = function () {
    let mm = this.getMonth() + 1
    let dd = this.getDate()

    return [this.getFullYear(), mm, dd].join('-')
  }

  const dates = {
    startDate: function () {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - 7)
      return startDate.yyyymmdd()
    },
    endDate: function () {
      const endDate = new Date()
      return endDate.yyyymmdd()
    }
  }

  const app = {
    apiURL: `https://api.github.com/search/repositories?q=created%3A%22${dates.startDate()}+..+${dates.endDate()}%22%20language%3Ajavascript&sort=stars&order=desc`,
    cardTemplate: document.querySelector('.card-template')
  }


})()