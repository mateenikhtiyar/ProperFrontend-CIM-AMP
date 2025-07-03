import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronRight, Search } from "lucide-react";
import { Country, State } from "country-state-city";

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

  // Handler for country checkbox (no city logic)
  const handleCountryToggle = (country: any) => {
    const countryName = country.name;
    const states = State.getStatesOfCountry(country.isoCode);
    const allStateNames = states.map((state) => `${country.name} > ${state.name}`);
    const isSelected = selectedCountries.includes(countryName);

    let newSelected: string[];
    if (isSelected) {
      // Deselect country and all its states
      newSelected = selectedCountries.filter(
        (item) => item !== countryName && !allStateNames.includes(item)
      );
    } else {
      // Select country and all its states
      newSelected = [
        ...selectedCountries.filter(
          (item) => item !== countryName && !allStateNames.includes(item)
        ),
        countryName,
        ...allStateNames,
      ];
    }
    onChange([...new Set(newSelected)]);
  };

  // Handler for state checkbox (no city logic)
  const handleStateToggle = (country: any, state: any) => {
    const stateName = `${country.name} > ${state.name}`;
    const isSelected = selectedCountries.includes(stateName);

    let newSelected: string[];
    if (isSelected) {
      // Deselect state
      newSelected = selectedCountries.filter((item) => item !== stateName);
    } else {
      // Select state
      newSelected = [...selectedCountries, stateName];
    }
    onChange([...new Set(newSelected)]);
  };

  // Remove handler for pills (no city logic)
  const handleRemove = (item: string) => {
    // If it's a country, remove it and all its states
    const country = Country.getAllCountries().find((c) => c.name === item);
    if (country) {
      const states = State.getStatesOfCountry(country.isoCode);
      const allStateNames = states.map((state) => `${country.name} > ${state.name}`);
      onChange(selectedCountries.filter((i) => i !== item && !allStateNames.includes(i)));
      return;
    }
    // If it's a state, just remove the state
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
                className="mr-2 h-4 w-4 text-[#3aafa9] focus:ring-[#3aafa9] checked:bg-[#3aafa9] checked:border-[#3aafa9]"

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
                        className="mr-2 h-4 w-4 text-[#3aafa9] focus:ring-[#3aafa9] checked:bg-[#3aafa9] checked:border-[#3aafa9]"

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