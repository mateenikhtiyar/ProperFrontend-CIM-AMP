import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronRight, Search } from "lucide-react";
import { Country, State, City } from "country-state-city";

interface GeographySelectorProps {
  selectedCountries: string[];
  onChange: (countries: string[]) => void;
  searchTerm: string;
}

const GeographySelector: React.FC<GeographySelectorProps> = ({ selectedCountries, onChange, searchTerm }) => {
  const [expandedCountries, setExpandedCountries] = useState<Record<string, boolean>>({});
  const [expandedStates, setExpandedStates] = useState<Record<string, boolean>>({});

  const allCountries = Country.getAllCountries().filter((country) =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper to get all state and city names for a country
  const getAllStateAndCityNames = (country: any) => {
    const states = State.getStatesOfCountry(country.isoCode);
    let allNames: string[] = [];
    states.forEach((state) => {
      allNames.push(`${country.name} > ${state.name}`);
      const cities = City.getCitiesOfState(country.isoCode, state.isoCode);
      cities.forEach((city) => {
        allNames.push(`${country.name} > ${state.name} > ${city.name}`);
      });
    });
    return allNames;
  };

  // Helper to get all city names for a state
  const getAllCityNames = (country: any, state: any) => {
    const cities = City.getCitiesOfState(country.isoCode, state.isoCode);
    return cities.map((city) => `${country.name} > ${state.name} > ${city.name}`);
  };

  // Handler for country checkbox
  const handleCountryToggle = (country: any) => {
    const countryName = country.name;
    const allChildren = getAllStateAndCityNames(country);
    const isSelected = selectedCountries.includes(countryName);

    let newSelected: string[];
    if (isSelected) {
      // Deselect country and all children
      newSelected = selectedCountries.filter(
        (item) =>
          item !== countryName &&
          !allChildren.includes(item)
      );
    } else {
      // Select country and all children
      newSelected = [
        ...selectedCountries.filter(
          (item) =>
            item !== countryName &&
            !allChildren.includes(item)
        ),
        countryName,
        ...allChildren,
      ];
    }
    onChange([...new Set(newSelected)]);
  };

  // Handler for state checkbox
  const handleStateToggle = (country: any, state: any) => {
    const stateName = `${country.name} > ${state.name}`;
    const allChildren = getAllCityNames(country, state);
    const isSelected = selectedCountries.includes(stateName);

    let newSelected: string[];
    if (isSelected) {
      // Deselect state and all its cities
      newSelected = selectedCountries.filter(
        (item) =>
          item !== stateName &&
          !allChildren.includes(item)
      );
    } else {
      // Select state and all its cities
      newSelected = [
        ...selectedCountries.filter(
          (item) =>
            item !== stateName &&
            !allChildren.includes(item)
        ),
        stateName,
        ...allChildren,
      ];
    }
    onChange([...new Set(newSelected)]);
  };

  // Handler for city checkbox
  const handleCityToggle = (country: any, state: any, city: any) => {
    const cityName = `${country.name} > ${state.name} > ${city.name}`;
    const isSelected = selectedCountries.includes(cityName);
    let newSelected: string[];
    if (isSelected) {
      newSelected = selectedCountries.filter((item) => item !== cityName);
    } else {
      newSelected = [...selectedCountries, cityName];
    }
    onChange([...new Set(newSelected)]);
  };

  // Remove handler for pills
  const handleRemove = (item: string) => {
    // If it's a country, remove it and all its children
    const country = Country.getAllCountries().find((c) => c.name === item);
    if (country) {
      const allChildren = getAllStateAndCityNames(country);
      onChange(
        selectedCountries.filter(
          (i) => i !== item && !allChildren.includes(i)
        )
      );
      return;
    }
    // If it's a state, remove it and all its cities
    for (const country of Country.getAllCountries()) {
      const states = State.getStatesOfCountry(country.isoCode);
      const state = states.find((s) => `${country.name} > ${s.name}` === item);
      if (state) {
        const allCities = getAllCityNames(country, state);
        onChange(
          selectedCountries.filter(
            (i) => i !== item && !allCities.includes(i)
          )
        );
        return;
      }
    }
    // Otherwise, just remove the city
    onChange(selectedCountries.filter((i) => i !== item));
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="space-y-2 font-poppins flex-1 overflow-y-auto min-h-0">
        {allCountries.map((country) => (
          <div key={country.isoCode} className="border-b border-gray-100 pb-1">
            <div className="flex items-center">
              <input
                type="checkbox"
                id={`geo-${country.isoCode}`}
                checked={selectedCountries.includes(country.name)}
                onChange={() => handleCountryToggle(country)}
                className="mr-2 h-4 w-4 text-[#3aafa9] focus:ring-[#3aafa9]"
              />
              <div
                className="flex items-center cursor-pointer flex-1"
                onClick={() =>
                  setExpandedCountries((prev) => ({
                    ...prev,
                    [country.isoCode]: !prev[country.isoCode],
                  }))
                }
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
                {State.getStatesOfCountry(country.isoCode).map((state) => (
                  <div key={state.isoCode} className="pl-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`geo-${country.isoCode}-${state.isoCode}`}
                        checked={selectedCountries.includes(
                          `${country.name} > ${state.name}`
                        )}
                        onChange={() => handleStateToggle(country, state)}
                        className="mr-2 h-4 w-4 text-[#3aafa9] focus:ring-[#3aafa9]"
                      />
                      <div
                        className="flex items-center cursor-pointer flex-1"
                        onClick={() =>
                          setExpandedStates((prev) => ({
                            ...prev,
                            [`${country.isoCode}-${state.isoCode}`]:
                              !prev[`${country.isoCode}-${state.isoCode}`],
                          }))
                        }
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
                    {expandedStates[`${country.isoCode}-${state.isoCode}`] && (
                      <div className="ml-6 mt-1 space-y-1">
                        {City.getCitiesOfState(
                          country.isoCode,
                          state.isoCode
                        ).map((city, cityIndex) => (
                          <div key={`city-${city.name}-${cityIndex}`} className="pl-4">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id={`geo-${country.isoCode}-${state.isoCode}-${city.name}`}
                                checked={selectedCountries.includes(
                                  `${country.name} > ${state.name} > ${city.name}`
                                )}
                                onChange={() =>
                                  handleCityToggle(country, state, city)
                                }
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