const {
    getAvailableCruises,
    searchCruisesByDestinationId,
} = require('../../services/tripadvisor-cruises-service');
const { MARKERS } = require('../../helpers/test-run-helpers/constants');
const { getLogger } = require('../../init/initialize-logger');

const logger = getLogger();

describe(`TripAdvisor Cruises ${MARKERS.PROGRESSION}`, () => {
    it('The list of ships is not empty', async () => {
        const allCruises = await getAvailableCruises();

        const caribbeanCruise = allCruises.filter((cr) => cr.name === 'Caribbean');

        const caribbeanDestinationId = caribbeanCruise.find((cr) => cr.destinationId)
            ?.destinationId;
        // 147237
        const allCaribbeanCruises = await searchCruisesByDestinationId({
            destinationId: caribbeanDestinationId,
        });

        const vessels = allCaribbeanCruises.list;

        vessels.sort((a, b) => b.ship.crew - a.ship.crew);

        vessels.forEach((vessel) => {
            logger.debug(
                `Ship Name: ${vessel.ship.name}, Ship id: ${vessel.ship.id}, Crew Number: ${vessel.ship.crew}`,
            );
        });

        expect(vessels.length).toBeGreaterThan(0);
    });
});
