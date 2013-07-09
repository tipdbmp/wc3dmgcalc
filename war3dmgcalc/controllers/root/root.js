w3dc.controller('RootCtrl', function($scope)
{
    $scope.sprintf = sprintf;
    
    $scope.attack_type = {};
    $scope.attack_types =
    [
        { name: 'attack-hero',     tooltip: 'Hero Damage', },
        { name: 'attack-melee',    tooltip: 'Normal Damage', },
        { name: 'attack-piercing', tooltip: 'Piercing Damage', },
        { name: 'attack-siege',    tooltip: 'Siege Damage', },
        { name: 'attack-magic',    tooltip: 'Magic Damage', },
        { name: 'attack-chaos',    tooltip: 'Chaos Damage', },
        { name: 'attack-spell',    tooltip: 'Spell Damage', },
    ];
    
    
    $scope.armor_type = {};
    $scope.armor_types =
    [
        { name: 'armor-hero',      tooltip: 'Hero Armor', },
        { name: 'armor-light',     tooltip: 'Light Armor', },
        { name: 'armor-medium',    tooltip: 'Medium Armor', },
        { name: 'armor-large',     tooltip: 'Heavy Armor', },
        { name: 'armor-normal',    tooltip: 'Normal Armor', },
        { name: 'armor-unarmored', tooltip: 'Unarmored' },
        { name: 'armor-fortified', tooltip: 'Fortified Armor', },
        { name: 'armor-divine',    tooltip: 'Divine Armor', },
    ];
    
    $scope.dmg = {};
    $scope.dmg.min = 100;
    $scope.dmg.max = 100;
    
    $scope.armor = {};
    $scope.armor.points = 0;
    
    $scope.dmg_bonus_table =
    {
        'attack-hero': 
        { 
            'armor-hero':      1.00,
            'armor-light':     1.00,
            'armor-medium':    1.00,
            'armor-large':     1.00,
            'armor-normal':    1.00,
            'armor-unarmored': 1.00,
            'armor-fortified': 0.50,
            'armor-divine':    0.05,
        },

        'attack-melee': 
        { 
            'armor-hero':      1.00,
            'armor-light':     1.00,
            'armor-medium':    1.50,
            'armor-large':     1.00,
            'armor-normal':    1.00,
            'armor-unarmored': 1.00,
            'armor-fortified': 0.70,
            'armor-divine':    0.05,
        },
        
        'attack-piercing': 
        { 
            'armor-hero':      0.50,
            'armor-light':     2.00,
            'armor-medium':    0.75,
            'armor-large':     1.00,
            'armor-normal':    1.00,
            'armor-unarmored': 1.50,
            'armor-fortified': 0.35,
            'armor-divine':    0.05,
        },
        
        'attack-siege': 
        { 
            'armor-hero':      0.50,
            'armor-light':     1.00,
            'armor-medium':    0.50,
            'armor-large':     1.00,
            'armor-normal':    1.00,
            'armor-unarmored': 1.50,
            'armor-fortified': 1.50,
            'armor-divine':    0.05,
        },
    
        'attack-magic': 
        { 
            'armor-hero':      0.50,
            'armor-light':     1.25,
            'armor-medium':    0.75,
            'armor-large':     2.00,
            'armor-normal':    1.00,
            'armor-unarmored': 1.00,
            'armor-fortified': 0.35,
            'armor-divine':    0.05,
        },
        
        'attack-chaos': 
        { 
            'armor-hero':      1.00,
            'armor-light':     1.00,
            'armor-medium':    1.00,
            'armor-large':     1.00,
            'armor-normal':    1.00,
            'armor-unarmored': 1.00,
            'armor-fortified': 1.00,
            'armor-divine':    1.00,
        },
        
        'attack-spell': 
        { 
            'armor-hero':      0.70,
            'armor-light':     1.00,
            'armor-medium':    1.00,
            'armor-large':     1.00,
            'armor-normal':    1.00,
            'armor-unarmored': 1.00,
            'armor-fortified': 1.00,
            'armor-divine':    0.05,
        },
    };

    
    $scope.current_attack_type = 'non-selected';
    $scope.set_current_attack_type = function($attack_type)
    {
        var $img = $('#img-' + $attack_type);
        if ($scope.current_attack_type === $attack_type)
        {
            $scope.current_attack_type = 'non-selected';
            $img.toggleClass('selected');
            return;
        }
        
        $scope.current_attack_type = $attack_type;
//        console.log('current attack type: ' + $scope.current_attack_type);

        $img.toggleClass('selected');
        
        $scope.attack_types.forEach(function(e)
        {
            var name = e.name;
            var $e = $('#img-' + e.name);
            if (name !== $attack_type)
            {
                $e.removeClass('selected');
            }
        });
    };
    
    $scope.current_armor_type = 'non-selected';
    $scope.set_current_armor_type = function($armor_type)
    {
        var $img = $('#img-' + $armor_type);
        if ($scope.current_armor_type === $armor_type)
        {
            $scope.current_armor_type = 'non-selected';
            $img.toggleClass('selected');
            return;
        }
        
        $scope.current_armor_type = $armor_type;
//        console.log('current armor type: ' + $scope.current_armor_type);
        
        $img.toggleClass('selected');
        
        $scope.armor_types.forEach(function(e)
        {
            var name = e.name;
            var $e = $('#img-' + e.name);
            if (name !== $armor_type)
            {
                $e.removeClass('selected');
            }
        });
    };
    
    $scope.armor_damage_reduction_multiplier = 0.06;
    $scope.damage_bonus_ethereal_multiplier  = 1.66;
    $scope.armor_reduction                   = 0;
    $scope.is_ethereal                       = false;
    
    var calculate_armor_reduction = function(armor_points)
    {
        var armor_reduction;
        
        if (isNaN(armor_points)) { return 0; }
        if (armor_points === 0)  { return 0 ; }
        
        if (armor_points > 0)
        {
            armor_reduction = (    armor_points * $scope.armor_damage_reduction_multiplier)
                            / (1 + armor_points * $scope.armor_damage_reduction_multiplier)
                            ;
        }
        else if (armor_points < 0 )
        {
            armor_reduction = -1 + Math.pow(0.94, Math.min(20, -armor_points));
        }
        
        $scope.armor_reduction = armor_reduction;
        return armor_reduction;
    };
    
    var calculate_final_damage = function(damage)
    {
        if ($scope.current_attack_type === 'non-selected'
        ||  $scope.current_armor_type  === 'non-selected')
        {
            return 0;   
        }
        
        // only magic and spell attack can damage ethereal units
        if 
        (
            $scope.is_ethereal
        &&
            (
                $scope.current_attack_type !== 'attack-magic'
            &&  $scope.current_attack_type !== 'attack-spell'
            )
        )
        {
            return 0;
        }
        
        console.log('damage: ' + damage);
        
        var damage_bonus    = $scope.dmg_bonus_table[$scope.current_attack_type][$scope.current_armor_type];
//        console.log(damage_bonus);
        
        var armor_reduction = calculate_armor_reduction($scope.armor.points); 
        
        var final_damage = 
            (damage * (damage_bonus - damage_bonus * armor_reduction))
        
                                        + 
        (
            $scope.is_ethereal 
        && 
            (
                $scope.current_attack_type === 'attack-magic' 
            ||  $scope.current_attack_type === 'attack-spell'
            )
        ?
            (damage * damage_bonus * ($scope.damage_bonus_ethereal_multiplier - 1)) 
                                        * 
                                (1 - armor_reduction)
        
        :                               0
        )
        ;
        
        if (isNaN(final_damage)) { return 0; }
        return sprintf('%.2f', final_damage);
    };
    
    $scope.calculate_min_damage = function()
    {
        return calculate_final_damage($scope.dmg.min);  
    };
    
    $scope.calculate_avg_damage = function()
    {
        return calculate_final_damage(($scope.dmg.min + $scope.dmg.max) / 2);
    };
    
    $scope.calculate_max_damage = function()
    {
        return calculate_final_damage($scope.dmg.max);  
    };
    
    $scope.get_armor_reduction = function()
    {
        return Math.round(isNaN($scope.armor_reduction) ? 0 : $scope.armor_reduction * 100) + '%';  
    };
});

