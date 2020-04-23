const IndexAvailableService = require("../services/IndexAvailableService");

class AvailableController {
  async index(req, res) {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: "Invalid Date" });
    }

    const seachDate = Number(date);

    try {
      const availables = await IndexAvailableService.run({
        provider_id: req.params.providerId,
        seachDate,
      });

      return res.json(availables);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
}

module.exports = new AvailableController();
