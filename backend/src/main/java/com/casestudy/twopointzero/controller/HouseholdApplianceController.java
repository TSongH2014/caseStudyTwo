package com.casestudy.twopointzero.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.casestudy.twopointzero.exception.HouseholdAppliancesNotFoundException;
import com.casestudy.twopointzero.model.HouseholdAppliance;
import com.casestudy.twopointzero.repository.HouseholdApplianceRepository;

@RestController
@RequestMapping("/")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class HouseholdApplianceController {

	@Autowired
	private HouseholdApplianceRepository householdApplianceRepository;
	
	
	// get (all) household appliances
	@GetMapping("householdappliances")
	public List<HouseholdAppliance> getAllHouseholdAppliances() {
		return this.householdApplianceRepository.findAll();
	}
	
	// get (search filter) household appliances (By RequestParam: compared to [By Url], better & flexible for user, who can omit any search field!)
	@GetMapping("/householdappliances/search")
	public List<HouseholdAppliance> getFilteredHouseholdAppliances2(
			@RequestParam(value = "brand", required = false) Optional<String> brand, 
			@RequestParam(value = "model", required = false) Optional<String> model, 
			@RequestParam(value = "serialNumber", required = false) Optional<String> serialNumber,
			@RequestParam(value = "status", required = false) Optional<String> status,
			@RequestParam(value = "dateBought", required = false) Optional<String> dateBought
			) throws HouseholdAppliancesNotFoundException {
		
		if (!brand.isPresent() || !model.isPresent() || !serialNumber.isPresent() || !status.isPresent() || !dateBought.isPresent()) {
			return this.householdApplianceRepository.findAll();
		} else {
			return this.householdApplianceRepository.search2(brand, model, serialNumber, status, dateBought);
		}
	}
	
	// create new household appliance
	@PostMapping("householdappliances")
	public HouseholdAppliance createHouseholdAppliance(@RequestBody HouseholdAppliance householdAppliance) {
		HouseholdAppliance createdHouseholdAppliance = householdApplianceRepository.save(new HouseholdAppliance(householdAppliance.getBrand(), 
				householdAppliance.getModel(), householdAppliance.getSerialNumber(),null ,"New"));
		return createdHouseholdAppliance;
		
	}
	
	// update existing household appliance
	@PutMapping("householdappliances/{id}")
	public ResponseEntity<HouseholdAppliance> updateHouseholdAppliance(@PathVariable(value = "id") Long id,
			@Valid @RequestBody HouseholdAppliance householdAppliance) throws HouseholdAppliancesNotFoundException {
		
		HouseholdAppliance householdAppliance2 = householdApplianceRepository.findById(id)
				.orElseThrow(() -> new HouseholdAppliancesNotFoundException("Household Appliance not found for this id: " + id));
		
		householdAppliance2.setBrand(householdAppliance.getBrand());
		householdAppliance2.setDateBought(householdAppliance.getDateBought());
		householdAppliance2.setModel(householdAppliance.getModel());
		householdAppliance2.setSerialNumber(householdAppliance.getSerialNumber());
		householdAppliance2.setStatus(householdAppliance.getStatus());
		
		return ResponseEntity.ok(this.householdApplianceRepository.save(householdAppliance2));
	}
	
	// remove existing household appliance
	@DeleteMapping("householdappliances/{id}")
	public Map<String, Boolean> removeHouseholdAppliance(@PathVariable(value = "id") Long id) throws HouseholdAppliancesNotFoundException {
		
		HouseholdAppliance householdAppliance2 = householdApplianceRepository.findById(id)
				.orElseThrow(() -> new HouseholdAppliancesNotFoundException("Household Appliance not found for this id: " + id));
		
		this.householdApplianceRepository.delete(householdAppliance2);
//		this.householdApplianceRepository.deleteById(id);
		
		Map<String, Boolean> response = new HashMap<>();
		response.put("deleted", Boolean.TRUE);
		return response;
		
	}
	
}