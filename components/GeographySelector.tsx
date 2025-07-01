import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronRight, Search } from "lucide-react";
import { Country, State, City } from "country-state-city";

interface GeographySelectorProps {
  selectedCountries: string[];
  onChange: (countries: string[]) => void;
}

const GeographySelector: React.FC<GeographySelectorProps> = ({ selectedCountries, onChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCountries, setExpandedCountries] = useState<Record<string, boolean>>({});
  const [expandedStates, setExpandedStates] = useState<Record<string, boolean>>({});

  const allCountries = Country.getAllCountries().filter((country) =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatesAndCities = (countryCode: string) => {
    const states = State.getStatesOfCountry(countryCode);
    return states.map((state) => ({
      ...state,
      cities: City.getCitiesOfState(countryCode, state.isoCode),
    }));
  };

  // Helper for multi-select
  const handleCheck = (value: string, checked: boolean) => {
    if (checked) {
      if (!selectedCountries.includes(value)) {
        onChange([...selectedCountries, value]);
      }
    } else {
      onChange(selectedCountries.filter((v) => v !== value));
    }
  };

  return (
    <div>
      <div className="relative mb-4">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-[#667085]" />
        <Input
          placeholder="Search country, state, or city"
          className="pl-8 border-[#d0d5dd]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="space-y-2 font-poppins max-h-64 overflow-y-auto">
        {allCountries.map((country) => (
          <div key={country.isoCode} className="border-b border-gray-100 pb-1">
            <div className="flex items-center">
              <input
                type="checkbox"
                id={`geo-${country.isoCode}`}
                checked={selectedCountries.includes(country.name)}
                onChange={(e) => handleCheck(country.name, e.target.checked)}
                className="mr-2 h-4 w-4 text-[#3aafa9] focus:ring-[#3aafa9]"
              />
              <div
                className="flex items-center cursor-pointer flex-1"
                onClick={() => setExpandedCountries((prev) => ({ ...prev, [country.isoCode]: !prev[country.isoCode] }))}
              >
                {expandedCountries[country.isoCode] ? (
                  <ChevronDown className="h-4 w-4 mr-1 text-gray-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 mr-1 text-gray-500" />
                )}
                <Label htmlFor={`geo-${country.isoCode}`} className="text-[#344054] cursor-pointer font-medium">
                  {country.name}
                </Label>
              </div>
            </div>
            {expandedCountries[country.isoCode] && (
              <div className="ml-6 mt-1 space-y-1">
                {getStatesAndCities(country.isoCode).map((state) => (
                  <div key={state.isoCode} className="pl-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`geo-${country.isoCode}-${state.isoCode}`}
                        checked={selectedCountries.includes(`${country.name} > ${state.name}`)}
                        onChange={(e) => handleCheck(`${country.name} > ${state.name}`, e.target.checked)}
                        className="mr-2 h-4 w-4 text-[#3aafa9] focus:ring-[#3aafa9]"
                      />
                      <div
                        className="flex items-center cursor-pointer flex-1"
                        onClick={() => setExpandedStates((prev) => ({ ...prev, [`${country.isoCode}-${state.isoCode}`]: !prev[`${country.isoCode}-${state.isoCode}`] }))}
                      >
                        {expandedStates[`${country.isoCode}-${state.isoCode}`] ? (
                          <ChevronDown className="h-4 w-4 mr-1 text-gray-500" />
                        ) : (
                          <ChevronRight className="h-4 w-4 mr-1 text-gray-500" />
                        )}
                        <Label htmlFor={`geo-${country.isoCode}-${state.isoCode}`} className="text-[#344054] cursor-pointer">
                          {state.name}
                        </Label>
                      </div>
                    </div>
                    {expandedStates[`${country.isoCode}-${state.isoCode}`] && state.cities.length > 0 && (
                      <div className="ml-6 mt-1 space-y-1">
                        {state.cities.slice(0, 10).map((city, cityIndex) => (
                          <div key={`city-${city.name}-${cityIndex}`} className="pl-4">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id={`geo-${country.isoCode}-${state.isoCode}-${city.name}`}
                                checked={selectedCountries.includes(`${country.name} > ${state.name} > ${city.name}`)}
                                onChange={(e) => handleCheck(`${country.name} > ${state.name} > ${city.name}`, e.target.checked)}
                                className="mr-2 h-4 w-4 text-[#3aafa9] focus:ring-[#3aafa9]"
                              />
                              <Label htmlFor={`geo-${country.isoCode}-${state.isoCode}-${city.name}`} className="text-[#344054] cursor-pointer">
                                {city.name}
                              </Label>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GeographySelector; 