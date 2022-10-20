const { dockStart } = require('@nlpjs/basic');
var nlp;
var dock;
(async () => {
    dock = await dockStart({ use: ['Basic'] });
    nlp = dock.get('nlp');
    await nlp.addCorpus('./Modules/discordBot/talk/corpus.json');
    await nlp.train();
})();


const system = {
    async talk(msg) {
        const response = await nlp.process('zh', msg);
        return response.answer;
    }
}

module.exports = system;
