import { TechnicalAnalisysRepository } from "../../../domain/ta/TechnicalAnalisysRepository";
import { UseCaseBase } from "../UseCaseBase";
import { RegisterPluginsRequest } from "./RegisterPluginsRequest";
import { RegisterPluginsResponse } from "./RegisterPluginsResponse";

export class RegisterPluginsUseCase extends UseCaseBase<RegisterPluginsRequest, RegisterPluginsResponse> {
    readonly #repo: TechnicalAnalisysRepository;
    public constructor(repo: TechnicalAnalisysRepository) {
        super();
        this.#repo = repo;
    }
    protected async run(requestModel: RegisterPluginsRequest): Promise<RegisterPluginsResponse> {
        let plugins = requestModel.plugins;
        let pairs = requestModel.tradingPairs;
        plugins.forEach(plugin => {
            plugin.transferContext(this.#repo);
            plugin.getIndicatorParameters().forEach(indParam => {
                this.#repo.addIndicatorParameters(indParam);
            });
        });
        return new RegisterPluginsResponse(plugins);
    }
}