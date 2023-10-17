module.exports = {
    datetime() {
        const date = new Date()
        return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")} ${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
    },
    print(text) {
        console.log(`[${this.datetime()}] ${text}`)
    }
}