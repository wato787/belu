import { createRoute } from "../../../helpers/create-route";
import { createPetRoute } from "./create-pet";
import { deletePetRoute } from "./delete-pet";
import { getPetRoute } from "./get-pet";
import { listPetsRoute } from "./list-pets";
import { updatePetRoute } from "./update-pet";

const petsRoute = createRoute();

petsRoute.route("/", listPetsRoute);
petsRoute.route("/", createPetRoute);
petsRoute.route("/", getPetRoute);
petsRoute.route("/", updatePetRoute);
petsRoute.route("/", deletePetRoute);

export { petsRoute };
