import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Control, useFormContext } from "react-hook-form";

// Country and state data
export const COUNTRIES = [
  { value: "US", label: "United States" },
  { value: "IN", label: "India" },
  { value: "CA", label: "Canada" },
  { value: "AU", label: "Australia" },
  { value: "Others", label: "Others" }
];

export const STATES_BY_COUNTRY = {
  US: [
    { value: "AL", label: "Alabama" },
    { value: "AK", label: "Alaska" },
    { value: "AZ", label: "Arizona" },
    { value: "AR", label: "Arkansas" },
    { value: "CA", label: "California" },
    { value: "CO", label: "Colorado" },
    { value: "CT", label: "Connecticut" },
    { value: "DE", label: "Delaware" },
    { value: "FL", label: "Florida" },
    { value: "GA", label: "Georgia" },
    { value: "HI", label: "Hawaii" },
    { value: "ID", label: "Idaho" },
    { value: "IL", label: "Illinois" },
    { value: "IN", label: "Indiana" },
    { value: "IA", label: "Iowa" },
    { value: "KS", label: "Kansas" },
    { value: "KY", label: "Kentucky" },
    { value: "LA", label: "Louisiana" },
    { value: "ME", label: "Maine" },
    { value: "MD", label: "Maryland" },
    { value: "MA", label: "Massachusetts" },
    { value: "MI", label: "Michigan" },
    { value: "MN", label: "Minnesota" },
    { value: "MS", label: "Mississippi" },
    { value: "MO", label: "Missouri" },
    { value: "MT", label: "Montana" },
    { value: "NE", label: "Nebraska" },
    { value: "NV", label: "Nevada" },
    { value: "NH", label: "New Hampshire" },
    { value: "NJ", label: "New Jersey" },
    { value: "NM", label: "New Mexico" },
    { value: "NY", label: "New York" },
    { value: "NC", label: "North Carolina" },
    { value: "ND", label: "North Dakota" },
    { value: "OH", label: "Ohio" },
    { value: "OK", label: "Oklahoma" },
    { value: "OR", label: "Oregon" },
    { value: "PA", label: "Pennsylvania" },
    { value: "RI", label: "Rhode Island" },
    { value: "SC", label: "South Carolina" },
    { value: "SD", label: "South Dakota" },
    { value: "TN", label: "Tennessee" },
    { value: "TX", label: "Texas" },
    { value: "UT", label: "Utah" },
    { value: "VT", label: "Vermont" },
    { value: "VA", label: "Virginia" },
    { value: "WA", label: "Washington" },
    { value: "WV", label: "West Virginia" },
    { value: "WI", label: "Wisconsin" },
    { value: "WY", label: "Wyoming" },
    { value: "DC", label: "District of Columbia" },
    { value: "AS", label: "American Samoa" },
    { value: "GU", label: "Guam" },
    { value: "MP", label: "Northern Mariana Islands" },
    { value: "PR", label: "Puerto Rico" },
    { value: "UM", label: "United States Minor Outlying Islands" },
    { value: "VI", label: "Virgin Islands, U.S." }
  ],
  IN: [
    { value: "Andhra Pradesh", label: "Andhra Pradesh" },
    { value: "Arunachal Pradesh", label: "Arunachal Pradesh" },
    { value: "Assam", label: "Assam" },
    { value: "Bihar", label: "Bihar" },
    { value: "Chhattisgarh", label: "Chhattisgarh" },
    { value: "Goa", label: "Goa" },
    { value: "Gujarat", label: "Gujarat" },
    { value: "Haryana", label: "Haryana" },
    { value: "Himachal Pradesh", label: "Himachal Pradesh" },
    { value: "Jharkhand", label: "Jharkhand" },
    { value: "Karnataka", label: "Karnataka" },
    { value: "Kerala", label: "Kerala" },
    { value: "Madhya Pradesh", label: "Madhya Pradesh" },
    { value: "Maharashtra", label: "Maharashtra" },
    { value: "Manipur", label: "Manipur" },
    { value: "Meghalaya", label: "Meghalaya" },
    { value: "Mizoram", label: "Mizoram" },
    { value: "Nagaland", label: "Nagaland" },
    { value: "Odisha", label: "Odisha" },
    { value: "Punjab", label: "Punjab" },
    { value: "Rajasthan", label: "Rajasthan" },
    { value: "Sikkim", label: "Sikkim" },
    { value: "Tamil Nadu", label: "Tamil Nadu" },
    { value: "Telangana", label: "Telangana" },
    { value: "Tripura", label: "Tripura" },
    { value: "Uttar Pradesh", label: "Uttar Pradesh" },
    { value: "Uttarakhand", label: "Uttarakhand" },
    { value: "West Bengal", label: "West Bengal" }
  ],
  CA: [
    { value: "Alberta", label: "Alberta" },
    { value: "British Columbia", label: "British Columbia" },
    { value: "Manitoba", label: "Manitoba" },
    { value: "New Brunswick", label: "New Brunswick" },
    { value: "Newfoundland and Labrador", label: "Newfoundland and Labrador" },
    { value: "Nova Scotia", label: "Nova Scotia" },
    { value: "Ontario", label: "Ontario" },
    { value: "Prince Edward Island", label: "Prince Edward Island" },
    { value: "Quebec", label: "Quebec" },
    { value: "Saskatchewan", label: "Saskatchewan" },
    { value: "Nunavut", label: "Nunavut" },
    { value: "Yukon", label: "Yukon" }
  ],
  AU: [
    { value: "New South Wales", label: "New South Wales" },
    { value: "Victoria", label: "Victoria" },
    { value: "Queensland", label: "Queensland" },
    { value: "South Australia", label: "South Australia" },
    { value: "Western Australia", label: "Western Australia" },
    { value: "Tasmania", label: "Tasmania" },
    { value: "Northern Territory", label: "Northern Territory" },
    { value: "Australian Capital Territory", label: "Australian Capital Territory" },
    { value: "Jervis Bay Territory", label: "Jervis Bay Territory" },
    { value: "Territory of Christmas Island", label: "Territory of Christmas Island" },
    { value: "Territory of the Cocos (Keeling) Islands", label: "Territory of the Cocos (Keeling) Islands" },
    { value: "Norfolk Island", label: "Norfolk Island" }
  ]
};

interface CountryStateSelectProps {
  control: Control<any>;
  countryName: string;
  stateName: string;
  customCountryName?: string;
  countryLabel?: string;
  stateLabel?: string;
  customCountryLabel?: string;
  disabled?: boolean;
}

export const CountryStateSelect: React.FC<CountryStateSelectProps> = ({
  control,
  countryName,
  stateName,
  customCountryName,
  countryLabel = "Country",
  stateLabel = "State",
  customCountryLabel = "Custom Country",
  disabled = false
}) => {
  const form = useFormContext();
  
  return (
    <>
      <FormField
        control={control}
        name={countryName}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{countryLabel}</FormLabel>
            <FormControl>
              <Select 
                value={field.value} 
                onValueChange={(value) => {
                  field.onChange(value);
                  // Clear state when country changes
                  form.setValue(stateName, '');
                  // Clear custom country when switching to predefined countries
                  if (customCountryName && value !== 'Others') {
                    form.setValue(customCountryName, '');
                  }
                }}
                disabled={disabled}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((country) => (
                    <SelectItem key={country.value} value={country.value}>
                      {country.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Custom Country Input - Only show when "Others" is selected */}
      {customCountryName && (
        <FormField
          control={control}
          name={customCountryName}
          render={({ field }) => {
            const selectedCountry = form.watch(countryName);
            if (selectedCountry !== 'Others') return null;
            
            return (
              <FormItem>
                <FormLabel>{customCountryLabel}</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Enter country name"
                    disabled={disabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      )}

      <FormField
        control={control}
        name={stateName}
        render={({ field }) => {
          const selectedCountry = form.watch(countryName);
          const isCustomCountry = selectedCountry === 'Others';
          const availableStates = selectedCountry && !isCustomCountry ? STATES_BY_COUNTRY[selectedCountry as keyof typeof STATES_BY_COUNTRY] : [];
          
          return (
            <FormItem>
              <FormLabel>{stateLabel}</FormLabel>
              <FormControl>
                {isCustomCountry ? (
                  <Input 
                    {...field} 
                    placeholder="Enter state/province name"
                    disabled={disabled}
                  />
                ) : availableStates && availableStates.length > 0 ? (
                  <Select 
                    value={field.value} 
                    onValueChange={field.onChange}
                    disabled={disabled || !selectedCountry}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableStates.map((state) => (
                        <SelectItem key={state.value} value={state.value}>
                          {state.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input 
                    {...field} 
                    placeholder="Enter state/province name"
                    disabled={disabled || !selectedCountry}
                  />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
    </>
  );
};